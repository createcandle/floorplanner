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
#import subprocess
#import threading
#import requests
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
        
        self.addon_name = 'floorplanner'
        self.DEBUG = False
            
        #self.things = [] # Holds all the things, updated via the API. Used to display a nicer thing name instead of the technical internal ID.
            
        self.fullscreen_delay = 60
        self.search_url = "https://swisscows.com/en/web?query="
        
        self.restore_tabs = True
        self.history_length = 10
        self.slideshow = False
            
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
        
        try:
            self.addon_path =  os.path.join(self.user_profile['addonsDir'], self.addon_name)
            #self.persistence_file_folder = os.path.join(self.user_profile['configDir'])
            self.persistence_file_path = os.path.join(self.user_profile['dataDir'], self.addon_name, 'persistence.json')
            
        except Exception as e:
            print("Failed to make paths: " + str(e))
            
        # Get persistent data
        self.persistent_data = {}
        try:
            with open(self.persistence_file_path) as f:
                self.persistent_data = json.load(f)
                if self.DEBUG:
                    print('self.persistent_data loaded from file: ' + str(self.persistent_data))
                
        except:
            pass
            #if self.DEBUG:
            #    print("could not load persistent data (if you just installed the add-on then this is normal)")

        


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
            
        except:
            print("Error! Failed to open settings database.")
            self.close_proxy()
        
        if not config:
            print("Error loading config from database")
            return

        if 'Debugging' in config:
            self.DEBUG = bool(config['Debugging'])
            if self.DEBUG:
                print("-Debugging preference was in config: " + str(self.DEBUG))

        if 'Restore tabs' in config:
            self.restore_tabs = bool(config['Restore tabs'])
            if self.DEBUG:
                print("-Restore tabs preference was in config: " + str(self.restore_tabs))
                
        if 'Browsing history length' in config:
            self.history_length = int(config['Browsing history length'])
            if self.DEBUG:
                print("-Browsing history length preference was in config: " + str(self.history_length))
                
        if 'Fullscreen delay' in config:
            self.fullscreen_delay = int(config['Fullscreen delay'])
            if self.DEBUG:
                print("-Fullscreen delay preference was in config: " + str(self.fullscreen_delay))
                
        if 'Slideshow' in config:
            self.slideshow = bool(config['Slideshow'])
            if self.DEBUG:
                print("-Slideshow preference was in config: " + str(self.slideshow))
                
        if 'Search URL' in config:
            self.search_url = str(config['Search URL'])
            if self.DEBUG:
                print("-Search url preference was in config: " + str(self.search_url))
        


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
                    
                    return APIResponse(
                      status=200,
                      content_type='application/json',
                      content=json.dumps({
                                        'action':action,
                                        'search_url':str(self.search_url),
                                        'fullscreen_delay':self.fullscreen_delay,
                                        'restore_tabs':self.restore_tabs,
                                        'history_length':self.history_length,
                                        'slideshow':self.slideshow
                                        }),
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

            with open(self.persistence_file_path) as f:
                if self.DEBUG:
                    print("saving: " + str(self.persistent_data))
                try:
                    json.dump( self.persistent_data, open( self.persistence_file_path, 'w+' ) )
                except Exception as ex:
                    print("Error saving to persistence file: " + str(ex))
                return True
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