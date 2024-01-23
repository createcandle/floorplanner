"""Floorplanner API handler."""


import functools
import json
import os
#import re
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))
#from os import listdir
#from os.path import isfile, join
#from time import sleep, time
#import random
#import datetime
import subprocess
#import threading
import requests
#import base64

try:
    from gateway_addon import APIHandler, APIResponse
    #print("succesfully loaded APIHandler and APIResponse from gateway_addon")
except:
    print("Import APIHandler and APIResponse from gateway_addon failed. Use at least WebThings Gateway version 0.10")

try:
    from gateway_addon import Adapter, Device, Database
except:
    print("Gateway not loaded?!")

print = functools.partial(print, flush=True)






_TIMEOUT = 3

_CONFIG_PATHS = [
    os.path.join(os.path.expanduser('~'), '.webthings', 'config'),
]

if 'WEBTHINGS_HOME' in os.environ:
    _CONFIG_PATHS.insert(0, os.path.join(os.environ['WEBTHINGS_HOME'], 'config'))




class FloorplannerAPIHandler(APIHandler):
    """Floorplanner API handler."""

    def __init__(self, verbose=False):
        """Initialize the object."""
        #print("INSIDE API HANDLER INIT")
        
        self.ready = False
        self.addon_name = 'floorplanner'
        self.DEBUG = False
            
        #self.things = [] # Holds all the things, updated via the API. Used to display a nicer thing name instead of the technical internal ID.
            
        self.per_browser_settings = False
        
        self.cups_printer_available = False
        self.peripage_printer_available = False
        
        self.persistent_data = {}
        
        try:
            manifest_fname = os.path.join(
                os.path.dirname(__file__),
                '..',
                'manifest.json'
            )

            with open(manifest_fname, 'rt') as f:
                manifest = json.load(f)

            APIHandler.__init__(self, manifest['id'])
            self.manager_proxy.add_api_handler(self)
            

            # LOAD CONFIG
            try:
                self.add_from_config()
            except Exception as ex:
                print("Error loading config: " + str(ex))

            
            if self.DEBUG:
                print("self.manager_proxy = " + str(self.manager_proxy))
                print("Created new API HANDLER: " + str(manifest['id']))
        except Exception as e:
            print("Failed to init UX extension API handler: " + str(e))
        
        
        # PATHS
        self.addon_path =  os.path.join(self.user_profile['addonsDir'], self.addon_name)
        #self.persistence_file_folder = os.path.join(self.user_profile['configDir'])
        self.persistence_file_path = os.path.join(self.user_profile['dataDir'], self.addon_name, 'persistence.json')
        
        self.printable_file_path = os.path.join(self.user_profile['dataDir'], 'floorplan.svg')    
        self.external_picture_drop_dir = os.path.join(self.user_profile['dataDir'], 'privacy-manager', 'printme')
            
        
        # Get persistent data
        try:
            with open(self.persistence_file_path) as f:
                self.persistent_data = json.load(f)
                if self.DEBUG:
                    print('self.persistent_data loaded from file. ') # + str(self.persistent_data))
                
        except Exception as ex:
            #pass
            if self.DEBUG:
                print("could not load persistent data (if you just installed the add-on then this is normal): " + str(ex))
        
        if not 'floorplans' in self.persistent_data:
            self.persistent_data['floorplans'] = {}
            
        if not 'visible_things' in self.persistent_data:
            self.persistent_data['visible_things'] = {}
            
        if not 'settings' in self.persistent_data or self.per_browser_settings == True:
            self.persistent_data['settings'] = None

        
        self.check_photo_printer()
        self.ready = True
        

    # Read the settings from the add-on settings page
    def add_from_config(self):
        """Attempt to add all configured devices."""
        try:
            database = Database(self.addon_name)
            if not database.open():
                print("Could not open settings database")
                return
            
            config = database.load_config()
            database.close()
            
        except Exception as ex:
            print("Error! Failed to open settings database: " + str(ex))
            self.close_proxy()
        
        if not config:
            print("Error loading config from database")
            return

        if 'Per browser settings' in config:
            self.per_browser_settings = bool(config['Per device settings'])
            if self.DEBUG:
                print("-Per device settings preference was in config: " + str(self.per_browser_settings))

        if 'Debugging' in config:
            self.DEBUG = bool(config['Debugging'])
            if self.DEBUG:
                print("-Debugging preference was in config: " + str(self.DEBUG))

        
        
    def check_photo_printer(self):
        if self.DEBUG:
            print("Checking if a cups or bluetooth photo printer is paired")
        
        self.cups_printer_available = False
        self.peripage_printer_available = False

        try:
            
            lpstat_output = run_command("lpstat -v")
            if 'No destinations added' in lpstat_output:
                if self.DEBUG:
                    print("No network printers connected")
                
                
                # See if there is a Peripage photo printer connected
                if os.path.isdir(self.external_picture_drop_dir):
                    if self.DEBUG:
                        print("privacy manager photo drop-off dir existed")
                    bluetooth_printer_check = run_command('sudo bluetoothctl devices Paired')
                    if self.DEBUG:
                        print("bluetooth_printer_check: " + str(bluetooth_printer_check))
                    if 'peripage' in bluetooth_printer_check.lower():
                        self.peripage_printer_available = True
                        if self.DEBUG:
                            print("paired bluetooth printer was detected")
                        return True
              
            
            
            else:
                if self.DEBUG:
                    print("a cups printer is connected")
                self.cups_printer_available = True
                return True
            
                    
        except Exception as ex:
            print("Error while checking for printer: " + str(ex))
        
        return False




    def handle_request(self, request):
        """
        Handle a new API request for this handler.

        request -- APIRequest object
        """
        
        try:
        
            if request.method != 'POST':
                #print("not post")
                return APIResponse(status=404)
            
            if request.path == '/ajax':
                
                action = str(request.body['action'])
                
                
                # INIT
                if action == 'init':
                    if self.DEBUG:
                        print("handling init request")
                    
                    #print("request.body: " + str(type(request.body)));
                        
                    try:
                        if 'visible_things' in request.body:
                            self.persistent_data['visible_things'] = request.body['visible_things']
                            
                        if 'floorplans' in request.body:
                            self.persistent_data['floorplans'] = request.body['floorplans']
                            
                        if 'settings' in request.body:
                            self.persistent_data['settings'] = request.body['settings']
                    
                        self.save_persistent_data()
                    
                    except Exception as ex:
                        if self.DEBUG:
                            print("Error handling save: " + str(ex))
                        
                    return APIResponse(
                      status=200,
                      content_type='application/json',
                      content=json.dumps({
                                        'action':action,
                                        'debug':self.DEBUG,
                                        'visible_things':self.persistent_data['visible_things'],
                                        'floorplans':self.persistent_data['floorplans'],
                                        'settings':self.persistent_data['settings'],
                                        }),
                    )
                                        # 'per_browser_settings':self.per_browser_settings
                
                
                
                # INIT
                if action == 'save':
                    if self.DEBUG:
                        print("handling save request")
                    
                    #print("request.body: " + str(type(request.body)));
                    state = False
                    try:
                        if 'visible_things' in request.body:
                            self.persistent_data['visible_things'] = request.body['visible_things']
                            
                        if 'floorplans' in request.body:
                            self.persistent_data['floorplans'] = request.body['floorplans']
                            
                        if 'settings' in request.body:
                            self.persistent_data['settings'] = request.body['settings']
                    
                        self.save_persistent_data()
                        state = True
                    
                    except Exception as ex:
                        if self.DEBUG:
                            print("Error handling save: " + str(ex))
                        
                    return APIResponse(
                      status=200,
                      content_type='application/json',
                      content=json.dumps({
                                        'state':state,
                                        'action':action,
                                        }),
                    )
                
                
                
                elif action == 'print':
                    if self.DEBUG:
                        print("printing")
                    state = 'unable to print'
                    
                    try:
                        if 'svg' in request.body:
                            #print("request.body['svg']: " + str(request.body['svg']))
                            #print("type: " + str(type(request.body['svg'])))
                            self.check_photo_printer()
                            
                            #print("self.printable_file_path: " + str(self.printable_file_path))
                            
                            with open(self.printable_file_path, 'w+') as f:
                                
                                if isinstance(request.body['svg'], str):
                                    
                                    f.write(request.body['svg'])
                                    if self.DEBUG:
                                        print("saved svg data to file: " + str(self.printable_file_path))
                                    
                                    if self.cups_printer_available:
                                        print_command = 'lp -o printer-error-policy=abort-job ' + str(self.printable_file_path)
                                        if self.DEBUG:
                                            print("printing using cups. Print command: \n" + str(print_command))
                                        os.system(print_command)
                                        state = "Floorplan image sent to (network) printer"
                                        
                                    elif self.peripage_printer_available:
                                        if os.path.isdir(self.external_picture_drop_dir):
                                            to_filename = os.path.join(self.external_picture_drop_dir, str(request.body['filename']))
                                            copy_command = 'mv -n ' + str(from_filename) + ' ' + str(to_filename)
                                            if self.DEBUG:
                                                print("move command: " + str(copy_command))
                                            os.system(copy_command)
                                            state = "Floorplan sent to bluetooth printer"
                                            # TODO: can it even print SVG files?
                                        else:
                                            if self.DEBUG:
                                                print("photo drop dir (no longer) exists?")
                                            state = 'peripage printer drop off directory did not exist'
                        
                                    else:
                                        state = 'No printer available?'
                                else:
                                    state = 'SVG data was not a string?'
                                        
                                        
                        else:
                            if self.DEBUG:
                                print("file to be printed did not exist")
                            state = 'no file to print provided'
                        
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps({'state':state}),
                        )
                    except Exception as ex:
                        print("Error sending photo to printer: " + str(ex))
                        return APIResponse(
                          status=500,
                        )
                
                
                # UNSUPPORTED ACTION
                else:
                    return APIResponse(
                      status=404,
                      content_type='application/json',
                      content=json.dumps({"error":"Unsupported action"}),
                    )
                        

                    
            else:
                if self.DEBUG:
                    print("unknown API path")
                return APIResponse(status=404)
               
                
        except Exception as ex:
            if self.DEBUG:
                print("Failed to handle UX extension API request: " + str(ex))
            return APIResponse(
              status=500,
              content_type='application/json',
              content=json.dumps({"error":"General API error"}),
            )
        



    # INIT
    def get_init_data(self):
        if self.DEBUG:
            print("Getting the initialisation data")
        

        
    # DELETE A FILE
    

    def unload(self):
        if self.DEBUG:
            print("Shutting down")
        return True



   


    def save_persistent_data(self):
        if self.DEBUG:
            print("Saving to persistence data store")

        try:
            if not os.path.isfile(self.persistence_file_path):
                open(self.persistence_file_path, 'a').close()
                if self.DEBUG:
                    print("Created an empty persistence file")
            else:
                if self.DEBUG:
                    print("Persistence file existed. Will try to save to it.")

            try:
                json.dump( self.persistent_data, open( self.persistence_file_path, 'w+' ) )
                return True
            except Exception as ex:
                print("Error saving to persistence file: " + str(ex))
            
            return False
                
            #self.previous_persistent_data = self.persistent_data.copy()

        except Exception as ex:
            if self.DEBUG:
                print("Error: could not store data in persistent store: " + str(ex) )
            return False



def run_command(cmd, timeout_seconds=20):
    try:
        
        p = subprocess.run(cmd, timeout=timeout_seconds, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, universal_newlines=True)

        if p.returncode == 0:
            return p.stdout # + '\n' + "Command success" #.decode('utf-8')
            #yield("Command success")
        else:
            if p.stderr:
                return "Error: " + str(p.stderr) # + '\n' + "Command failed"   #.decode('utf-8'))

    except Exception as e:
        print("Error running command: "  + str(e))