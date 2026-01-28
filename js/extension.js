(function() {
    class Floorplanner extends window.Extension {
        constructor() {
            super('floorplanner');
            //console.log("Adding Floorplanner to menu");
            //this.addMenuEntry('Floorplanner');


            window.extension_floorplanner_kiosk = false;
            this.kiosk = false;
            if (document.getElementById('virtualKeyboardChromeExtension') != null) {
                document.body.classList.add('kiosk');
                this.kiosk = true;
                window.extension_floorplanner_kiosk = true;
            }
            /*
            document.onmousemove = function(event)
            {
            	console.log("mouse moved");
             //cursor_x = event.pageX;
             //cursor_y = event.pageY;
            }
            */

            //console.log("floorplanner: this.id: ", this.id);

            //console.log(window.API);

            this.debug = false;
            this.content = '';

			this.revealed = false;




            // Check if screensaver should be active
            window.API.postJson(
                `/extensions/${this.id}/api/ajax`, {
                    'action': 'init'
                }

            ).then((body) => {


                if (typeof body.debug != 'undefined') {
                    this.debug = body.debug;

                }
                if (this.debug) {
                    console.log("floorplanner init response: ", body);
                }
                /*
                // Search URL
                if(typeof body.search_url != 'undefined'){
                	window.extension_floorplanner_search_url = body.search_url;
                	localStorage.setItem("extension_floorplanner_search_url",body.search_url);
                }
                
                
                // save history
                if(typeof body.history_length != 'undefined'){
                	window.extension_floorplanner_history_length = parseInt(body.history_length);
                	if(body.history_length){
                		window.extension_floorplanner_recent_urls = localStorage.getItem("extension_floorplanner_recent_urls");
                		
                		if(window.extension_floorplanner_recent_urls == null){
                			window.extension_floorplanner_recent_urls = [];
                		}
                		else{
                			window.extension_floorplanner_recent_urls = JSON.parse(window.extension_floorplanner_recent_urls);
                		}
                		if(this.debug){
                			console.log("floorplanner: window.extension_floorplanner_recent_urls: ",typeof window.extension_floorplanner_recent_urls, window.extension_floorplanner_recent_urls);
                		}
                	}
                	else{
                		window.extension_floorplanner_recent_urls = [];
                		localStorage.setItem("extension_floorplanner_recent_urls","[]");
                	}
                }
                
                
                // restore tabs
                if(typeof body.restore_tabs != 'undefined'){
                	if(body.restore_tabs){
                		window.extension_floorplanner_restore_tabs = true;
                		window.extension_floorplanner_restoring_tabs = true;
                		window.extension_floorplanner_open_tabs = localStorage.getItem("extension_floorplanner_open_tabs");
                		if(window.extension_floorplanner_open_tabs == null){
                			window.extension_floorplanner_open_tabs = [];
                		}
                		else{
                			window.extension_floorplanner_open_tabs = JSON.parse(window.extension_floorplanner_open_tabs);
                		}
                	}
                	else{
                		window.extension_floorplanner_open_tabs = [];
                		localStorage.setItem("extension_floorplanner_open_tabs","[]");
                	}
                }
                if(this.debug){
                	console.log("floorplanner: window.extension_floorplanner_restore_tabs: ", window.extension_floorplanner_restore_tabs);
                }
                
                // fullscreen delay
                if(typeof body.fullscreen_delay != 'undefined'){
                	window.extension_floorplanner_fullscreen_delay = parseInt(body.fullscreen_delay);
                	this.fullscreen_delay = parseInt(body.fullscreen_delay) * 1000;
                }
                
                // slideshow
                if(typeof body.slideshow != 'undefined'){
                	window.extension_floorplanner_slideshow = body.slideshow;
                	this.slideshow = body.slideshow;
                }
                
                if(this.debug){
                	console.log("floorplanner: fullscreen_delay: ", this.fullscreen_delay);
                }
                */


            }).catch((e) => {
                console.log("Floorplanner: error in ealy init function: ", e);
            });



            // Unicode lookup  https://symbl.cc/en/unicode/table/#arrows
            // Make SVG path relative https://svg-path.com/

			/*
	        window.onpopstate = history.onpushstate = (event) => {
      			if(this.revealed == false){
		            try{
		                if(this.debug){
		                    console.log('\n\nfloorplanner: debug: page history has been modified!: ', event);
		                    console.log("\n\n NEW PATH: ", event.state.path);
              
		                }
		                if(event.state.path == '/floorplan'){
							this.revealed = true;
		                	this.reveal_floorplanner();
		                }
		            }
		            catch(e){
		                console.error("Theme: error parsing window url change: ", e);
		            }
      			}
	            
      
	        };
			*/
			
            if (!document.location.pathname.endsWith("/floorplan")) {
				// This depends on the Candle Theme addon
				window.addEventListener('locationchange', () => {
					if(this.revealed == false){
						this.test_floorplanner_path();
					}
				});
			}
			

            
            //console.log("floorplan_view_el: ", floorplan_view_el);

            fetch(`/extensions/${this.id}/views/content.html`)
                .then((res) => res.text())
                .then((text) => {
                    this.content = text;
                    this.test_floorplanner_path();

                })
                .catch((e) => console.error('Floorplaner: failed to fetch content:', e));


        }


		test_floorplanner_path(){
			if(this.revealed == false && this.content != '' && document.location.pathname.endsWith("/floorplan")){
				let floorplan_view_el = document.getElementById('floorplan-view');
	            if (floorplan_view_el) {
					let fp_container_el = document.createElement('div');
					fp_container_el.id = 'extension-floorplanner-content-container';
	            	fp_container_el.innerHTML = this.content;
	           	 	//console.log("floorplanner: fp_container_el: ", fp_container_el);
	            
	                floorplan_view_el.appendChild(fp_container_el);
	                //generate_floorplans_list();
	                console.log("floorplanner: document.location.pathname ", document.location.pathname);
					this.revealed = true;
					setTimeout(() => {
	                	this.reveal_floorplanner();
					},1);
	            }
			}
		}







        show() {
			
			
			document.location.href = window.location.origin + '/floorplan';
			setTimeout(() => {
				this.view.innerHTML = '<a href="/floorplan"><h3 class="text-button" style="width:30rem; margin:20rem auto">Open Floorplanner</h3></a>';
			},2000);
			return;
			
            if (this.content == '') {
                return;
            } else {
                this.view.innerHTML = '<h1>How did you get here?</h1>';//this.content;
            }




        } // end of show function



        hide() {

        }






        delete_file(filename) {
            //console.log("Deleting file:" + filename);

            //const pre = document.getElementById('extension-floorplanner-response-data');
            /*
			const photo_list = document.getElementById('extension-floorplanner-photo-list');

            window.API.postJson(
                `/extensions/${this.id}/api/delete`, {
                    'action': 'delete',
                    'filename': filename
                }

            ).then((body) => {
                //console.log(body);
                this.show_list(body['data']);

            }).catch((e) => {
                console.log("Floorplanner: error in delete response: ", e);
                alert("Could not delete file - connection error?");
            });
			*/

        }

        reveal_floorplanner() {
            console.log("floorplanner: in reveal_floorplanner");

			this.revealed = true;
			
            var currently_editing = true;
            var currently_editing_an_object = false;
            var currently_cloning_an_object = false;
            let settings = {
                'auto_save': true,
                'multi_line': true,
                'dark_mode': null,
				'thing_icons_size':3
            }
			// settings.thing_icons_size can be between 1 and 5.

			var visible_things = {};
            if (localStorage.getItem('extension-floorplanner-visible-things') != null) {
				console.log("floorplanner: spotted visible_things info in browser local storage");
				try{
					visible_things = JSON.parse(localStorage.getItem('extension-floorplanner-visible-things'));
				}
				catch(e){
					console.error("floorplanner: failed to load visible things dict: ", e);
					visible_things = {};
				}
            }
			console.log("initial visible_things: ", visible_things);

			var skip_first_save_to_floorplans = true; // quick hacky fix which allows users to view a floorplan without immediately losing their edit history.

            if (localStorage.getItem('extension-floorplanner-settings') != null) {
                settings = JSON.parse(localStorage.getItem('extension-floorplanner-settings'));
                load_floorplanner_settings();
            }


            if (localStorage.getItem('extension-floorplanner-currently-editing') != null) {
                currently_editing = JSON.parse(localStorage.getItem('extension-floorplanner-currently-editing'));
            } else {
                localStorage.setItem('extension-floorplanner-currently-editing', JSON.stringify(true));
            }
            //console.log("currently_editing: ", typeof currently_editing, currently_editing);

            let current_filename = JSON.parse(localStorage.getItem('extension-floorplanner-current-filename'));
            if (current_filename != null) {
                document.getElementById('extension-floorplanner-current-filename').textContent = current_filename;
            }
            //console.log("current_filename: ", current_filename);

			// Set initial CSS that hides things from specific floorplans
			update_thing_styles();
			

            let tactile = false;
            let touch_ui = false;

            function is_touch_device() {
                try {
                    document.createEvent("TouchEvent");
                    return true;
                } catch (e) {
                    return false;
                }
            }
            touch_ui = is_touch_device();

            // Additions

            let floorplanner_started = false;

			let floorplan_view_el = document.getElementById('floorplan-view');
            let content_el = document.getElementById('extension-floorplanner-content');
            let root_el = document.getElementById('extension-floorplanner-tool-root');
            let panel_el = document.getElementById('extension-floorplanner-panel');
            let box_info_el = document.getElementById('extension-floorplanner-boxinfo');
            let bg_image_el = document.getElementById('extension-floorplanner-svg-container-bg-image');
            let linElement = document.getElementById('extension-floorplanner-lin');
            let floorplans_list_el = document.getElementById('extension-floorplanner-floorplans-list');
            //let layers_list_el = document.querySelector('#extension-floorplanner-layer_list');
            let newFileModal = document.getElementById('extension-floorplanner-newFileModal');


            let emojis = ['🧯', '🚪', '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🚰', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '❤️‍', '🔥', '❤️‍', '🩹', '💯', '♨️', '💢', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🌐', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄️', '🎴', '🎭️', '🔇', '🔈️', '🔉', '🔊', '🔔', '🔕', '🎼', '🎵', '🎶', '💹', '🏧', '🚮', '♿️', '🚹️', '🚺️', '🚻', '🚼️', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔️', '🚫', '🚳', '🚭️', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '⛎', '🔀', '🔁', '▶️', '⏩️', '⏭️', '⏯️', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧', '♾️', '〰️', '💱', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕️', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯️', '🉐', '🈹', '🈚️', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫️', '⚪️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️', '◼️', '◻️', '🔶', '🔷', '🔺', '💠', '🔘', '🔳', '🔲', '🛎️', '🧳', '⌛️', '⏳️', '⌚️', '⏰', '🕔️', '⏱️', '⏲️', '🕰️', '🌡️', '🗺️', '🧭', '🎃', '🎄', '🧨', '🎈', '🎉', '🎊', '🎎', '🎏', '🎐', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🔮', '🧿', '🎮️', '🕹️', '🎰', '🎲', '♟️', '🧩', '🧸', '🖼️', '🎨', '🧵', '🧶', '👓️', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓️', '🧢', '⛑️', '📿', '💄', '💍', '💎', '📢', '📣', '📯', '🎙️', '🎚️', '🎛️', '🎤', '🎧️', '📻️', '🎷', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '📱', '📲', '☎️', '📞', '📟️', '📠', '🔋', '🔌', '💻️', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿️', '📀', '🧮', '🎥', '🎞️', '📽️', '🎬️', '📺️', '📷️', '📸', '📹️', '📼', '🔍️', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚️', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰️', '💴', '💵', '💶', '💷', '💸', '💳️', '🧾', '✉️', '💌', '📧', '🧧', '📨', '📩', '📤️', '📥️', '📦️', '📫️', '📪️', '📬️', '📭️', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋️', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒️', '🔓️', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '💣️', '🏹', '🛡️', '🔧', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🪒', '🧴', '🧷', '🫧', '🧹', '🧺', '🧻', '🧼', '🧽', '🛒', '🚬', '⚰️', '⚱️', '🏺', '🕳️', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠️', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭️', '🏯', '🏰', '💒', '🗼', '🗽', '⛪️', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲️', '⛺️', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '🗾', '🏞️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇️', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍️', '🚎', '🚐', '🚑️', '🚒', '🚓', '🚔️', '🚕', '🚖', '🚗', '🚘️', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲️', '🛴', '🛹', '🚏', '🛣️', '🛤️', '🛢️', '⛽️', '🚨', '🚦', '🛑', '🚧', '⚓️', '⛵️', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🎆', '🎇', '🎑', '🗿', '⚽️', '⚾️', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳️', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🎖️', '🏆️', '🏅', '🥇', '🥈', '🥉', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕️', '🍵', '🍶', '🍾', '🍷', '🍸️', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🐵', '🐒', '🦍', '🦧', '🐶', '🐈️', '🐕️', '🦮', '🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻', '🐻‍', '❄️', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦️', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🐟️', '🐠', '🐡', '🦈', '🐙', '🦑', '🦀', '🦞', '🦐', '🦪', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🦠', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🎋', '🎍', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍️', '🌎️', '🌏️', '🌑', '🌒', '🌓', '🌔', '🌕️', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜️', '☀️', '🌝', '🌞', '🪐', '💫', '⭐️', '🌟', '✨', '🌠', '🌌', '☁️', '⛅️', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔️', '⛱️', '⚡️', '❄️', '☃️', '⛄️', '☄️', '🔥', '💧', '🌊', '💥', '💦', '💨', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐️', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '😮‍', '💨', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍', '🌫️', '🥴', '😵‍', '💫', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽️', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈️', '👉️', '👆️', '🖕', '👇️', '☝️', '👍️', '👎️', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂️', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🍼', '🎄', '🚶', '🚶‍♂️', '🚶‍♀️', '🧍', '🧍‍♂️', '🧍‍♀️', '🧎', '🧎‍♂️', '🧎‍♀️', '🦽', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '🤾', '🤹‍♀️', '🧘', '🛀', '🛌', '🤝‍', '👭', '👫', '👬', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '🗣️', '👤', '👥', '👣', '🔫', '∥', '⨻', '⟁', '▢', '⬨', '⊠', '▤', '▥', '▦', '▦', '▦', '▦', '⧇', '⊡', '⊞', '⧄', '◫', '◰', '❑', '⛋', '⌑', '⟤', '◙', '⬟', '⬡', '⏣', '◉', '⌾', '⊕', '◴', '⎉', '⎊', '◌', '⌽', '⊖', '⊜', '⬬', '⬭', '⌂', '▱', '▰', '➟', '➞', '⭤', '⮂', '᭚'];
            // '

            if (touch_ui) {
                content_el.classList.add('extension-floorplanner-touch');
            }


            let floorplans = JSON.parse(localStorage.getItem('extension-floorplanner-floorplans'));
            if (floorplans == null) {
                floorplans = {};
            } else {
                //console.log("FLOORPLANS FROM LOCAL STORAGE: ", floorplans);
            }


            let bounding_padding = -10;
            let rotation_snappyness = 5;
            let linked_scaling = false;
            let unsaved = false;
            let manual_bg_upload = false;


            //init
            let WALLS = [];
            let OBJDATA = [];
            let ROOM = [];
            let HISTORY = [];
            let wallSize = 20;
            let partitionSize = 8;
            let drag = 'off';
            let action = 0;
			let multi = 0;
            let magnetic = 0;
            let construc = 0;
            let Rcirclebinder = 8;
            let mode = 'select_mode';
            let modeOption;
            //console.log("linElement: ", linElement);

            let snap;

            let binder;
            let objTarget = null;

            var rect = linElement.getBoundingClientRect(); // get the bounding rectangle

            //console.log( rect.width );
            //console.log( rect.height);

            let taille_w = rect.width; //linElement.getBBox().width;
            let taille_h = rect.height; //linElement.getBBox().height;
            let offset = getOffset(linElement);
            //console.error("taille_w: ", taille_w);
            //console.log("lin element offset.top: ", offset.top);
            let grid = 20;
            let showRib = true;
            let showArea = true;
            let meter = 60;
            let grid_snap = 'off';
            let colorbackground = "#ffffff";
            let colorline = "#fff";
            let colorroom = "#f0daaf";
            let colorWall = "#666";
			let x = 0;
			let y = 0;
            let pox = 0;
            let poy = 0;
            let segment = 0;
            let xpath = 0;
            let ypath = 0;
            let width_viewbox = taille_w;
            let height_viewbox = taille_h;
            let ratio_viewbox = height_viewbox / width_viewbox;
            let originX_viewbox = 0;
            let originY_viewbox = 0;
            let zoom = 9;
            let factor = 1;

            let sizeText = [];
            let showAllSizeStatus = 0;

			let lineIntersectionP;

            let wallNode = null;
            let wallBind = null;
			let wallStartConstruc;
			let helpConstruc;
			let lineconstruc, helpConstrucEnd,wallEndConstruc,eq,lengthTemp,wallSelect,wallListObj,wallListRun,Rooms,equation1,equation2,equation3,equationFollowers,equationsObj,cross;
			let nodeMove;
			
			

			function adjust_sizes(){
	            var rect = linElement.getBoundingClientRect(); // get the bounding rectangle

	            //console.log( rect.width );
	            //console.log( rect.height);

	            taille_w = rect.width; //linElement.getBBox().width;
	            taille_h = rect.height; //linElement.getBBox().height;
	            offset = getOffset(linElement);
			}










			//----------------------- Quick SVG LIBRARY --------------------------------------------------
			//----------------------- V1.0 Licence MIT ---------------------------------------------------
			//----------------------- Author : Patrick RASPINO--------------------------------------------
			//----------------------- 11/08/16 -----------------------------------------------------------

			// 'use strict';

			var qSVG = {

			    create: function(id, shape, attrs) {
						//console.log("in createSVG. id, shape, attrs: ", id, shape, attrs);
						var shape = document.createElementNS("http://www.w3.org/2000/svg", shape);
						//console.log("create shape: shape: ", shape);
						if(typeof attrs != 'undefined'){
							for (var k in attrs) {
								//console.log("setting shape attributes: ", k, attrs[k]);
								if(k == 'fill' && attrs[k] == ''){
									//console.log("path with empty fill");
									shape.setAttribute('fill-opacity', '.5');
								}
								shape.setAttribute(k, attrs[k]); 
							}
						}
						else{
							//console.error("qSVG: create: attrs was undefined");
						}
        
						if (id != 'none') {
						  //console.log("qSVG: create: id: ", id);
							document.querySelector("#extension-floorplanner-" + id).append(shape);
						}
						else{
							//console.error("qSVG: create: id was undefined");
						}
			      return shape;
			    },

			    angleDeg: function(cx, cy, ex, ey) {
			      var dy = ey - cy;
			      var dx = ex - cx;
			      var theta = Math.atan2(dy, dx); // range (-PI, PI]
			      theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
			      if (theta < 0) theta = 360 + theta; // range [0, 360)
			      return theta;
			    },

			    angle: function(x1, y1, x2, y2, x3, y3) {
			        var x1 = parseInt(x1);
			        var y1 = parseInt(y1);
			        var x2 = parseInt(x2);
			        var y2 = parseInt(y2);
			        var anglerad;
			        if (!x3) {
			          if (x1 - x2 == 0) anglerad = Math.PI / 2;
			          else {
			            anglerad = Math.atan((y1 - y2) / (x1 - x2));
			          }
			            var angledeg = anglerad * 180 / Math.PI;
			        } else {
			            var x3 = parseInt(x3);
			            var y3 = parseInt(y3);
			            var a = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
			            var b = Math.sqrt(Math.pow(Math.abs(x2 - x3), 2) + Math.pow(Math.abs(y2 - y3), 2));
			            var c = Math.sqrt(Math.pow(Math.abs(x3 - x1), 2) + Math.pow(Math.abs(y3 - y1), 2));
			            if (a == 0 || b == 0) anglerad = Math.PI / 2;
			            else {
			              anglerad = Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b));
			            }
			            angledeg = (360 * anglerad) / (2*Math.PI);
			        }
			        return ({
			            rad: anglerad,
			            deg: angledeg
			        });
			    },

			    getAngle: function(el1, el2) {
			      return ({
			        rad: Math.atan2(el2.y - el1.y, el2.x - el1.x),
			        deg: Math.atan2(el2.y - el1.y, el2.x - el1.x)* 180 / Math.PI
			      });

			    },

			    middle: function(xo, yo, xd, yd) {
			        var x1 = parseInt(xo);
			        var y1 = parseInt(yo);
			        var x2 = parseInt(xd);
			        var y2 = parseInt(yd);
			        var middleX = Math.abs(x1 + x2) / 2;
			        var middleY = Math.abs(y1 + y2) / 2;
			        return ({
			            x: middleX,
			            y: middleY
			        });
			    },

			    triangleArea: function(fp, sp, tp) {
			      var A = 0;
			      var B = 0;
			      var C = 0;
			      var p = 0;
			      A = qSVG.measure(fp, sp);
			      B = qSVG.measure(sp, tp);
			      C = qSVG.measure(tp, fp);
			      p = (A + B + C) / 2;
			      return (Math.sqrt(p*(p-A)*(p-B)*(p-C)));
			    },

			    measure: function(po, pt) {
			        return Math.sqrt(Math.pow(po.x - pt.x, 2) + Math.pow(po.y - pt.y, 2));
			    },

			    gap: function(po, pt) {
			        return Math.pow(po.x - pt.x, 2) + Math.pow(po.y - pt.y, 2);
			    },

			    pDistance(point, pointA, pointB) {
			      var x = point.x;
			      var y = point.y;
			      var x1 = pointA.x;
			      var y1 = pointA.y;
			      var x2 = pointB.x;
			      var y2 = pointB.y;
			      var A = x - x1;
			      var B = y - y1;
			      var C = x2 - x1;
			      var D = y2 - y1;
			      var dot = A * C + B * D;
			      var len_sq = C * C + D * D;
			      var param = -1;
			      if (len_sq != 0) //in case of 0 length line
			          param = dot / len_sq;
			      var xx, yy;
			      if (param < 0) {
			        xx = x1;
			        yy = y1;
			      }
			      else if (param > 1) {
			        xx = x2;
			        yy = y2;
			      }
			      else {
			        xx = x1 + param * C;
			        yy = y1 + param * D;
			      }
			      var dx = x - xx;
			      var dy = y - yy;
			      return ({
			        x:  xx,
			        y:  yy,
			        distance: Math.sqrt(dx * dx + dy * dy)
			      });
			    },

			    nearPointOnEquation: function(equation, point) { // Y = Ax + B ---- equation {A:val, B:val}
			        var pointA = {};
			        var pointB = {};
			        if (equation.A == 'h') {
			          return ({
			            x:  point.x,
			            y:  equation.B,
			            distance: Math.abs(equation.B - point.y)
			          });
			        }
			        else if (equation.A == 'v') {
			          return ({
			            x:  equation.B,
			            y:  point.y,
			            distance: Math.abs(equation.B - point.x)
			          });
			        }
			        else {
			          pointA.x = point.x;
			          pointA.y = (equation.A * point.x) + equation.B;
			          pointB.x = (point.y - equation.B)/equation.A;
			          pointB.y = point.y;
			          return qSVG.pDistance(point, pointA, pointB);
			        }
			    },


			    circlePath: function(cx, cy, r){
			    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
			    },

			    createEquation: function(x0, y0, x1, y1) {
			      if (x1 - x0 == 0) {
			        return ({
			          A:  'v',
			          B:  x0
			        });}
			      else if (y1 - y0 == 0) {
			        return ({
			          A:  'h',
			          B:  y0
			        });}
			      else {
			        return ({
			          A:  (y1 - y0) / (x1 - x0),
			          B:  y1 - (x1 * ((y1 - y0) / (x1 - x0)))
			        });}
			    },

			    perpendicularEquation:  function(equation, x1, y1) {
			      if (typeof(equation.A) != "string") {
			        return ({
			          A:  (-1 / equation.A),
			          B:  y1 - ((-1 / equation.A) * x1)
			        });}
			      if (equation.A == 'h') {
			        return ({
			          A:  'v',
			          B:  x1
			        });}
			      if (equation.A == 'v') {
			        return ({
			          A:  'h',
			          B:  y1
			        });}
			    },

			    angleBetweenEquations: function(m1, m2) {
			      if (m1 == 'h') m1 = 0;
			      if (m2 == 'h') m2 = 0;
			      if (m1 == 'v') m1 = 10000;
			      if (m2 == 'v') m2 = 10000;
			      var angleRad =  Math.atan(Math.abs((m2 - m1) / (1 + (m1 * m2))));
			      return (360 * angleRad) / (2*Math.PI);
			    },

			    // type array return [x,y] ---- type object return {x:x, y:y}
			    intersectionOfEquations:  function(equation1, equation2, type = "array", message = false) {
			      var retArray;
			      var retObj;
			      if (equation1.A == equation2.A) {
			        retArray = false;
			        retObj = false;
			      }
			      if (equation1.A == 'v' && equation2.A == 'h') {
			        retArray = [equation1.B, equation2.B];
			        retObj = {x: equation1.B, y: equation2.B};
			      }
			      if (equation1.A == 'h' && equation2.A == 'v') {
			        retArray =  [equation2.B, equation1.B];
			        retObj = {x: equation2.B, y: equation1.B};
			      }
			      if (equation1.A == 'h' && equation2.A != 'v' && equation2.A != 'h') {
			        retArray =  [(equation1.B - equation2.B)/equation2.A, equation1.B];
			        retObj = {x: (equation1.B - equation2.B)/equation2.A, y: equation1.B};
			      }
			      if (equation1.A == 'v' && equation2.A != 'v' && equation2.A != 'h') {
			        retArray =  [equation1.B, (equation2.A * equation1.B) + equation2.B];
			        retObj = {x: equation1.B, y: (equation2.A * equation1.B) + equation2.B};
			      }
			      if (equation2.A == 'h' && equation1.A != 'v' && equation1.A != 'h') {
			        retArray =  [(equation2.B - equation1.B)/equation1.A, equation2.B];
			        retObj = {x: (equation2.B - equation1.B)/equation1.A, y: equation2.B};
			      }
			      if (equation2.A == 'v' && equation1.A != 'v' && equation1.A != 'h') {
			        retArray =  [equation2.B, (equation1.A * equation2.B) + equation1.B];
			        retObj = {x: equation2.B, y: (equation1.A * equation2.B) + equation1.B};
			      }
			      if (equation1.A != 'h' && equation1.A != 'v' && equation2.A != 'v' && equation2.A != 'h') {
			        var xT = (equation2.B - equation1.B) / (equation1.A - equation2.A);
			        var yT = (equation1.A * xT) + equation1.B;
			        retArray =  [xT, yT];
			        retObj = {x: xT, y: yT};
			      }
			      if (type == "array") return retArray;
			      else return retObj;
			    },

			    vectorXY: function(obj1, obj2) {
			      return ({
			        x:  obj2.x - obj1.x,
			        y:  obj2.y - obj1.y
			      });
			    },

			    vectorAngle: function(v1, v2) {
			      return (Math.atan2((v2.y-v1.y),(v2.x-v1.x))+Math.PI/2) * (180/Math.PI);
			    },

			    vectorDeter:  function(v1, v2) {
			      return (v1.x * v2.y)-(v1.y * v2.x);
			    },

			    btwn: function(a, b1, b2, round = false) {
			      if (round) {
			        a = Math.round(a);
			        b1 = Math.round(b1);
			        b2 = Math.round(b2);
			      }
			      if ((a >= b1) && (a <= b2)) { return true; }
			      if ((a >= b2) && (a <= b1)) { return true; }
			      return false;
			    },

			    nearPointFromPath: function(Pathsvg, point, range = Infinity) {
			        var pathLength = Pathsvg.getTotalLength();
			        if (pathLength>0) {
			        var precision = 40;
			        var best;
			        var bestLength;
			        var bestDistance = Infinity;
			        for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
			            scan = Pathsvg.getPointAtLength(scanLength);
			            scanDistance = qSVG.gap(scan, point);
			            if (scanDistance < bestDistance) {
			                best = scan, bestLength = scanLength, bestDistance = scanDistance;
			            }
			          }
			          // binary search for precise estimate
			          precision /= 2;
			          while (precision > 1) {
			            var before,
			            after,
			            beforeLength,
			            afterLength,
			            beforeDistance,
			            afterDistance;
			            if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = qSVG.gap(before = Pathsvg.getPointAtLength(beforeLength), point)) < bestDistance) {
			              best = before, bestLength = beforeLength, bestDistance = beforeDistance;
			              } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = qSVG.gap(after = Pathsvg.getPointAtLength(afterLength), point)) < bestDistance) {
			                best = after, bestLength = afterLength, bestDistance = afterDistance;
			              } else {
			                precision /= 2;
			              }
			            }

			          if (bestDistance <= (range*range)) {
			            return ({
			                x: best.x,
			                y: best.y,
			                length: bestLength,
			                distance: bestDistance,
			                seg: Pathsvg.getPathSegAtLength(bestLength)
			              });
			            } else {
			            return false;
			          }
			      }else {
			        return false;
			      }
			    },

			      //  ON PATH RETURN FALSE IF 0 NODE ON PATHSVG WITH POINT coords
			    //  RETURN INDEX ARRAY OF NODEs onPoint
			    getNodeFromPath: function(Pathsvg, point, except = ['']) {
			        var nodeList = Pathsvg.getPathData();
			        var k = 0;
			        var nodes = [];
			        var countNode = 0;
			        for (k = 0; k < nodeList.length; k++) {
			            if (nodeList[k].values[0] == point.x && nodeList[k].values[1] == point.y && nodeList[k].type != 'Z') {
			                if (except.indexOf(k) == -1) {
			                  countNode++;
			                  nodes.push(k);
			                }
			              }
			        }
			        if (countNode == 0) return false;
			        else return nodes;
			    },

			    // RETURN ARRAY [{x,y}, {x,y}, ...] OF REAL COORDS POLYGON INTO WALLS, THICKNESS PARAM
			    polygonIntoWalls:  function(vertex, surface) {
			      var vertexArray = surface;
			      var wall = [];
			      var polygon = [];
			      for (var rr = 0; rr < vertexArray.length; rr++) {
			        polygon.push({x: vertex[vertexArray[rr]].x, y: vertex[vertexArray[rr]].y});
			      }
			      // FIND EDGE (WALLS HERE) OF THESE TWO VERTEX
			      for (var i = 0 ; i < vertexArray.length-1; i++) {
			        for (var segStart = 0; segStart < vertex[vertexArray[i+1]].segment.length; segStart++) {
			          for (var segEnd = 0; segEnd < vertex[vertexArray[i]].segment.length; segEnd++) {
			            if (vertex[vertexArray[i+1]].segment[segStart] == vertex[vertexArray[i]].segment[segEnd]) {
			              wall.push({x1: vertex[vertexArray[i]].x, y1: vertex[vertexArray[i]].y, x2: vertex[vertexArray[i+1]].x, y2: vertex[vertexArray[i+1]].y, segment: vertex[vertexArray[i+1]].segment[segStart]});
			            }
			          }
			        }
			      }
			      // CALC INTERSECS OF EQ PATHS OF THESE TWO WALLS.
			      var inside = [];
			      var outside = [];
			      for (var i = 0; i < wall.length; i++) {
			        var inter = [];
			        var edge = wall[i];
			        if (i < wall.length - 1) var nextEdge = wall[i+1];
			        else var nextEdge = wall[0];
			        var angleEdge = Math.atan2(edge.y2 - edge.y1, edge.x2 - edge.x1);
			        var angleNextEdge = Math.atan2(nextEdge.y2 - nextEdge.y1, nextEdge.x2 - nextEdge.x1);
			        var edgeThicknessX = (WALLS[edge.segment].thick/2) * Math.sin(angleEdge);
			        var edgeThicknessY = (WALLS[edge.segment].thick/2) * Math.cos(angleEdge);
			        var nextEdgeThicknessX = (WALLS[nextEdge.segment].thick/2) * Math.sin(angleNextEdge);
			        var nextEdgeThicknessY = (WALLS[nextEdge.segment].thick/2) * Math.cos(angleNextEdge);
			        var eqEdgeUp = qSVG.createEquation(edge.x1 + edgeThicknessX, edge.y1 - edgeThicknessY, edge.x2 + edgeThicknessX, edge.y2 - edgeThicknessY);
			        var eqEdgeDw = qSVG.createEquation(edge.x1 - edgeThicknessX, edge.y1 + edgeThicknessY, edge.x2 - edgeThicknessX, edge.y2 + edgeThicknessY);
			        var eqNextEdgeUp = qSVG.createEquation(nextEdge.x1 + nextEdgeThicknessX, nextEdge.y1 - nextEdgeThicknessY, nextEdge.x2 + nextEdgeThicknessX, nextEdge.y2 - nextEdgeThicknessY);
			        var eqNextEdgeDw = qSVG.createEquation(nextEdge.x1 - nextEdgeThicknessX, nextEdge.y1 + nextEdgeThicknessY, nextEdge.x2 - nextEdgeThicknessX, nextEdge.y2 + nextEdgeThicknessY);

			        angleEdge = angleEdge * (180 / Math.PI);
			        angleNextEdge = angleNextEdge * (180 / Math.PI);

			          if (eqEdgeUp.A != eqNextEdgeUp.A) {
			              inter.push(qSVG.intersectionOfEquations(eqEdgeUp, eqNextEdgeUp, "object"));
			              inter.push(qSVG.intersectionOfEquations(eqEdgeDw, eqNextEdgeDw, "object"));
			          }
			          else {
			            inter.push({x: edge.x2 + edgeThicknessX, y: edge.y2 - edgeThicknessY});
			            inter.push({x: edge.x2 - edgeThicknessX, y: edge.y2 + edgeThicknessY});
			          }

			        for (var ii = 0;ii < inter.length; ii++) {
			          if (qSVG.rayCasting(inter[ii], polygon)) inside.push(inter[ii]);
			          else outside.push(inter[ii]);
			        }
			      }
			      inside.push(inside[0]);
			      outside.push(outside[0]);
			      return {inside: inside, outside: outside};
			    },

			    area: function(coordss) {
			      if (coordss.length < 2) return false;
			      var realArea = 0;
			      var j = (coordss.length)-1;
			      for (var i = 0; i < coordss.length; i++) {
			        realArea = realArea + ((coordss[j].x + coordss[i].x) * (coordss[j].y - coordss[i].y));
			        j = i;
			      }
			      realArea = realArea / 2;
			      return Math.abs(realArea.toFixed(2));
			    },

			    areaRoom: function (vertex, coords, digit = 2) {
			      var vertexArray = coords;
			      var roughArea = 0;
			      var j = (vertexArray.length)-2;
			      for (var i = 0; i < vertexArray.length-1; i++) {
			        roughArea = roughArea + ((vertex[vertexArray[j]].x + vertex[vertexArray[i]].x) * (vertex[vertexArray[j]].y - vertex[vertexArray[i]].y));
			        j = i;
			      }
			      roughArea = roughArea / 2;
			      return Math.abs(roughArea.toFixed(digit));
			    },

			    perimeterRoom: function (coords, digit = 2) {
			      var vertexArray = coords;
			      var roughRoom = 0;
			      for (i = 0; i < vertexArray.length-1; i++) {
			        added = qSVG.measure(vertex[vertexArray[i]], vertex[vertexArray[i+1]]);
			        roughRoom = roughRoom + added;
			      }
			      return roughRoom.toFixed(digit);
			    },

			    // H && V PROBLEM WHEN TWO SEGMENT ARE v/-> == I/->
			    junctionList: function(WALLS) {
			      var junction = [];
			      var segmentJunction = [];
			      var junctionChild = [];
			      // JUNCTION ARRAY LIST ALL SEGMENT INTERSECTIONS
			      for (var i = 0; i < WALLS.length; i++) {
			        var equation1 = qSVG.createEquation(WALLS[i].start.x, WALLS[i].start.y, WALLS[i].end.x, WALLS[i].end.y);
			        for (var v = 0; v < WALLS.length; v++) {
			          if (v != i) {
			            var equation2 = qSVG.createEquation(WALLS[v].start.x, WALLS[v].start.y, WALLS[v].end.x, WALLS[v].end.y);
			            var intersec;
			            if (intersec = qSVG.intersectionOfEquations(equation1, equation2)) {

			                if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y || WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
			                  if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y) {
			                    junction.push({segment:i, child: v, values: [WALLS[v].start.x, WALLS[v].start.y], type: "natural"});
			                  }
			                  if (WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
			                    junction.push({segment:i, child: v, values: [WALLS[i].start.x, WALLS[i].start.y], type: "natural"});
			                  }
			                }
			                else {
			                  if (qSVG.btwn(intersec[0], WALLS[i].start.x, WALLS[i].end.x, 'round') && qSVG.btwn(intersec[1], WALLS[i].start.y, WALLS[i].end.y, 'round') && qSVG.btwn(intersec[0], WALLS[v].start.x, WALLS[v].end.x, 'round') && qSVG.btwn(intersec[1], WALLS[v].start.y, WALLS[v].end.y, 'round')) {
			                    intersec[0] = intersec[0];
			                    intersec[1] = intersec[1];
			                    junction.push({segment:i, child: v, values: [intersec[0], intersec[1]], type: "intersection"});
			                  }
			                }
			            }
			            // IF EQ1 == EQ 2 FIND IF START OF SECOND SEG == END OF FIRST seg (eq.A maybe values H ou V)
			          if ((Math.abs(equation1.A) == Math.abs(equation2.A) || equation1.A == equation2.A) && equation1.B == equation2.B) {

			            if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y) {
			              junction.push({segment:i, child: v, values: [WALLS[v].start.x, WALLS[v].start.y], type: "natural"});
			            }
			            if (WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
			              junction.push({segment:i, child: v, values: [WALLS[i].start.x, WALLS[i].start.y], type: "natural"});
			            }
			            }
			          }
			        }
			      }
			      return junction;
			    },

			    vertexList: function(junction, segment) {
			      var vertex = [];
			      var vertextest = [];
			      for (var jj = 0; jj < junction.length; jj++) {
			        var found = true;
			        for (var vv = 0; vv < vertex.length; vv++) {
			          if ((Math.round(junction[jj].values[0]) == Math.round(vertex[vv].x)) && (Math.round(junction[jj].values[1]) == Math.round(vertex[vv].y))) {
			            found = false;
			            vertex[vv].segment.push(junction[jj].segment);
			            break;
			          }
			          else {
			            found = true;
			          }
			        }
			        if (found) {
			          vertex.push({x: Math.round(junction[jj].values[0]), y: Math.round(junction[jj].values[1]), segment: [junction[jj].segment], bypass:0, type: junction[jj].type});
			        }
			      }

			      var toClean = [];
			      for (var ss = 0; ss < vertex.length; ss++) {
			        vertex[ss].child = [];
			        vertex[ss].removed = [];
			        for (var sg = 0; sg < vertex[ss].segment.length; sg++) {
			          for (var sc = 0; sc < vertex.length; sc++) {
			            if (sc != ss) {
			              for (var scg = 0; scg < vertex[sc].segment.length; scg++) {
			                if (vertex[sc].segment[scg] == vertex[ss].segment[sg]) {
			                  vertex[ss].child.push({id: sc, angle: Math.floor(qSVG.getAngle(vertex[ss], vertex[sc]).deg)});
			                }
			              }
			            }
			          }
			        }
			        toClean = [];
			        for (var fr = 0; fr < vertex[ss].child.length-1; fr++) {
			          for (var ft = fr+1; ft < vertex[ss].child.length; ft++) {
			            if (fr != ft && typeof(vertex[ss].child[fr])!='undefined') {

			              found = true;

			              if (qSVG.btwn(vertex[ss].child[ft].angle, vertex[ss].child[fr].angle+3, vertex[ss].child[fr].angle-3, 'round') && found)
			              {
			                var dOne = qSVG.gap(vertex[ss], vertex[vertex[ss].child[ft].id]);
			                var dTwo = qSVG.gap(vertex[ss], vertex[vertex[ss].child[fr].id]);
			                if (dOne > dTwo) {
			                  toClean.push(ft);
			                }
			                else {
			                  toClean.push(fr);
			                  }
			              }
			            }
			          }
			        }
			        toClean.sort(function(a, b) {
			            return b-a;
			          });
			        toClean.push(-1);
			        for (var cc = 0; cc < toClean.length-1; cc++) {
			          if (toClean[cc] > toClean[(cc+1)]) {
			            vertex[ss].removed.push(vertex[ss].child[toClean[cc]].id);
			            vertex[ss].child.splice(toClean[cc], 1);
			          }
			        }
			      }
			      let vertexTest = vertex;
			      return vertex;
			    },

			    //*******************************************************
			    //* @arr1, arr2 = Array to compare                      *
			    //* @app = add function pop() or shift() to @arr1, arr2 *
			    //* False if arr1.length != arr2.length                 *
			    //* False if value into arr1[] != arr2[] - no order     *
			    //* *****************************************************
			    arrayCompare: function(arr1, arr2, app) {
			      // if (arr1.length != arr2.length) return false;
			      var minus = 0;
			      var start = 0;
			      if (app == 'pop') {
			        minus = 1;
			      }
			      if (app == 'shift') {
			        start = 1;
			      }
			      var coordCounter = arr1.length - minus - start;
			      for (var iFirst = start; iFirst < arr1.length-minus; iFirst++) {
			        for (var iSecond = start; iSecond < arr2.length-minus; iSecond++) {
			          if (arr1[iFirst] == arr2[iSecond]) {
			            coordCounter--;
			          }
			        }
			      }
			      if (coordCounter == 0) return true;
			      else return false;
			    },

			    vectorVertex: function(vex1, vex2, vex3) {
			      var vCurr = qSVG.vectorXY(vex1, vex2);
			      var vNext = qSVG.vectorXY(vex2, vex3);
			      var Na = Math.sqrt((vCurr.x * vCurr.x) + (vCurr.y * vCurr.y));
			      var Nb = Math.sqrt((vNext.x * vNext.x) + (vNext.y * vNext.y));
			      var C = ((vCurr.x * vNext.x) + (vCurr.y * vNext.y)) / (Na * Nb);
			      var S = ((vCurr.x * vNext.y) - (vCurr.y * vNext.x));
			      var BAC = Math.sign(S) * Math.acos(C);
			      return BAC*(180 / Math.PI );
			    },

			    segmentTree: function(VERTEX_NUMBER, vertex) {
			      var TREELIST = [VERTEX_NUMBER];
			      var WAY = [];
			      var COUNT = vertex.length;
			      var ORIGIN = VERTEX_NUMBER;
			      tree(TREELIST, ORIGIN, COUNT);
			      return WAY;

			      function tree(TREELIST, ORIGIN, COUNT) {
			        if (TREELIST.length == 0) return;
			        var TREETEMP = [];
			        COUNT--;
			        for (var k = 0;k < TREELIST.length; k++) {
			          var found = true;
			          var WRO = TREELIST[k];
			          var WRO_ARRAY = WRO.toString().split('-');
			          var WR = WRO_ARRAY[WRO_ARRAY.length - 1];

			          for (var v = 0; v < vertex[WR].child.length; v++) {
			            if (vertex[WR].child[v].id == ORIGIN && COUNT < (vertex.length - 1) && WRO_ARRAY.length > 2) { // WAYS HYPER
			                WAY.push(WRO+"-"+ORIGIN); // WAYS
			                found = false;
			                break;
			            }
			          }
			          if (found) {
			              var bestToAdd;
			              var bestDet = 0;
			              var nextVertex = -1;
			              // var nextVertexValue = 360;
			              var nextDeterValue = Infinity;
			              var nextDeterVal = 0;
			              var nextFlag = 0;
			              if (vertex[WR].child.length == 1) {
			                if (WR == ORIGIN && COUNT == (vertex.length - 1)) {
			                  TREETEMP.push(WRO+'-'+vertex[WR].child[0].id);
			                }
			                if (WR != ORIGIN  && COUNT < (vertex.length - 1)) {
			                  TREETEMP.push(WRO+'-'+vertex[WR].child[0].id);
			                }
			              }
			              else {
			                for (var v = 0; v < vertex[WR].child.length && vertex[WR].child.length > 0; v++) {
			                      if (WR == ORIGIN && COUNT == (vertex.length - 1)) { // TO INIT FUNCTION -> // CLOCKWISE Research
			                        var vDet = qSVG.vectorVertex({x: 0, y: -1}, vertex[WR], vertex[vertex[WR].child[v].id]);
			                        if (vDet >= nextDeterVal ) {
			                          nextFlag = 1;
			                          nextDeterVal = vDet;
			                          nextVertex = vertex[WR].child[v].id;
			                        }
			                        if (Math.sign(vDet) == -1  && nextFlag == 0) {
			                          if (vDet < nextDeterValue && Math.sign(nextDeterValue) > -1) {
			                            nextDeterValue = vDet;
			                            nextVertex = vertex[WR].child[v].id;
			                          }
			                          if (vDet > nextDeterValue && Math.sign(nextDeterValue) == -1) {
			                            nextDeterValue = vDet;
			                            nextVertex = vertex[WR].child[v].id;
			                          }
			                        }
			                      }
			                      if (WR != ORIGIN  && WRO_ARRAY[WRO_ARRAY.length-2] != vertex[WR].child[v].id && COUNT < (vertex.length - 1)) { // COUNTERCLOCKWISE Research
			                        var vDet = qSVG.vectorVertex(vertex[WRO_ARRAY[WRO_ARRAY.length-2]], vertex[WR], vertex[vertex[WR].child[v].id]);
			                        if (vDet < nextDeterValue  && nextFlag == 0) {
			                          nextDeterValue = vDet;
			                          nextVertex = vertex[WR].child[v].id;
			                        }
			                        if (Math.sign(vDet) == -1) {
			                          nextFlag = 1;
			                          if (vDet <= nextDeterValue) {
			                            nextDeterValue = vDet;
			                            nextVertex = vertex[WR].child[v].id;
			                          }
			                        }
			                      }
			                }
			                if (nextVertex != -1) TREETEMP.push(WRO+'-'+nextVertex);
			              }
			          }
			        }
			        if (COUNT > 0) tree(TREETEMP, ORIGIN, COUNT);
			      }
			    },

			    polygonize: function(segment) {
			       let junction = qSVG.junctionList(segment);
			       let vertex = qSVG.vertexList(junction, segment);
			       var vertexCopy = qSVG.vertexList(junction, segment);

			      var edgesChild = [];
			      for (var j = 0; j < vertex.length; j++) {
			        for (var vv = 0; vv < vertex[j].child.length; vv++) {
			          edgesChild.push([j, vertex[j].child[vv].id]);
			        }
			      }
			      var polygons = [];
			      var WAYS;
			      for (var jc = 0; jc < edgesChild.length; jc++) {
			          var bestVertex = 0;
			          var bestVertexValue = Infinity;
			          for (var j = 0; j < vertex.length; j++) {
			            if (vertex[j].x < bestVertexValue && vertex[j].child.length > 1 && vertex[j].bypass == 0) {
			              bestVertexValue = vertex[j].x;
			              bestVertex = j;
			            }
			            if (vertex[j].x == bestVertexValue && vertex[j].child.length > 1 && vertex[j].bypass == 0) {
			              if (vertex[j].y > vertex[bestVertex].y) {
			                bestVertexValue = vertex[j].x;
			                bestVertex = j;
			              }
			            }
			          }

			          // console.log("%c%s", "background: yellow; font-size: 14px;","RESEARCH WAY FOR STARTING VERTEX "+bestVertex);
			          WAYS = qSVG.segmentTree(bestVertex, vertex);
			          if (WAYS.length == 0) {
			            vertex[bestVertex].bypass = 1;
			          }
			          if (WAYS.length > 0) {
			            var tempSurface = WAYS[0].split('-');
			            var lengthRoom = qSVG.areaRoom(vertex, tempSurface);
			            var bestArea = parseInt(lengthRoom);
			              var found = true;
			              for (var sss = 0; sss < polygons.length; sss++) {
			                if (qSVG.arrayCompare(polygons[sss].way, tempSurface, 'pop') ) {
			                  found = false;
			                  vertex[bestVertex].bypass = 1;
			                  break;
			                }
			              }

			              if (bestArea < 360) {
			                vertex[bestVertex].bypass = 1;
			              }
			              if (vertex[bestVertex].bypass == 0)  { // <-------- TO REVISE IMPORTANT !!!!!!!! bestArea Control ???
			                var realCoords = qSVG.polygonIntoWalls(vertex, tempSurface);
			                var realArea = qSVG.area(realCoords.inside);
			                var outsideArea = qSVG.area(realCoords.outside);
			                var coords = [];
			                for (var rr = 0; rr < tempSurface.length; rr++) {
			                  coords.push({x: vertex[tempSurface[rr]].x, y: vertex[tempSurface[rr]].y});
			                }
			                // WARNING -> FAKE
			                if (realCoords.inside.length != realCoords.outside) {
			                  polygons.push({way: tempSurface, coords: coords, coordsOutside: realCoords.outside, coordsInside: realCoords.inside, area: realArea, outsideArea: outsideArea, realArea: bestArea});
			                }
			                else { // REAL INSIDE POLYGONE -> ROOM
			                  polygons.push({way: tempSurface, coords: realCoords.inside, coordsOutside: realCoords.outside, area: realArea, outsideArea: outsideArea, realArea: bestArea});
			                }

			                // REMOVE FIRST POINT OF WAY ON CHILDS FIRST VERTEX
			                for (var aa = 0; aa < vertex[bestVertex].child.length; aa++) {
			                  if (vertex[bestVertex].child[aa].id == tempSurface[1]) {
			                    vertex[bestVertex].child.splice(aa, 1);
			                  }
			                }

			                // REMOVE FIRST VERTEX OF WAY ON CHILDS SECOND VERTEX
			                for (var aa = 0; aa < vertex[tempSurface[1]].child.length; aa++) {
			                  if (vertex[tempSurface[1]].child[aa].id == bestVertex) {
			                    vertex[tempSurface[1]].child.splice(aa, 1);
			                  }
			                }
			                //REMOVE FILAMENTS ?????

			                do {
			                  var looping = 0;
			                  for (var aa = 0; aa < vertex.length; aa++) {
			                    if (vertex[aa].child.length == 1) {
			                      looping = 1;
			                      vertex[aa].child = [];
			                      for (var ab = 0; ab < vertex.length; ab++) { // OR MAKE ONLY ON THE WAY tempSurface ?? BETTER ??
			                        for (var ac = 0; ac < vertex[ab].child.length; ac++) {
			                          if (vertex[ab].child[ac].id == aa) {
			                            vertex[ab].child.splice(ac, 1);
			                          }
			                        }
			                      }
			                    }
			                  }
			                }
			                while (looping == 1);
			              }
			          }
			        }
			        //SUB AREA(s) ON POLYGON CONTAINS OTHERS FREE POLYGONS (polygon without commonSideEdge)
			        for (var pp = 0; pp < polygons.length; pp++) {
			          var inside = [];
			          for (var free = 0; free < polygons.length; free++) {
			            if (pp != free) {
			              var polygonFree = polygons[free].coords;
			              var countCoords = polygonFree.length;
			              var found = true;
			              for (let pf = 0; pf < countCoords; pf++) {
			                found = qSVG.rayCasting(polygonFree[pf], polygons[pp].coords);
			                if (!found) {
			                  break;
			                }
			              }
			              if (found) {
			                inside.push(free);
			                polygons[pp].area = polygons[pp].area - polygons[free].outsideArea;
			              }
			            }
			          }
			          polygons[pp].inside = inside;
			        }
			      return {polygons : polygons, vertex : vertex};
			    },

			    diffArray : function(arr1, arr2) {
			      return arr1.concat(arr2).filter(function (val) {
			        if (!(arr1.includes(val) && arr2.includes(val)))
			            return val;
			          });
			    },

			    diffObjIntoArray : function(arr1, arr2) {
			      var count = 0;
			      for (var k =0; k <arr1.length-1;k++) {
			        for (var n=0; n<arr2.length-1;n++) {
			          if (isObjectsEquals(arr1[k], arr2[n])) {
			            count++;
			          }
			        }
			      }
			      var waiting = arr1.length-1;
			      if (waiting < arr2.length-1) waiting = arr2.length;
			      return waiting-count;
			    },

			  rayCasting: function(point, polygon) {
			    var x = point.x, y = point.y;
			      var inside = false;
			      for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			          var xi = polygon[i].x, yi = polygon[i].y;
			          var xj = polygon[j].x, yj = polygon[j].y;
			          var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			          if (intersect) inside = !inside;
			      }
			    return inside;
			  },


			    //polygon = [{x1,y1}, {x2,y2}, ...]
			    polygonVisualCenter:  function(room) {
			    var polygon = room.coords;
			    var insideArray = room.inside;
			    var sample = 80;
			    var grid = [];
			    //BOUNDING BOX OF POLYGON
			    var minX, minY, maxX, maxY;
			    for (var i = 0; i < polygon.length; i++) {
			      var p = polygon[i];
			      if (!i || p.x < minX) minX = p.x;
			      if (!i || p.y < minY) minY = p.y;
			      if (!i || p.x > maxX) maxX = p.x;
			      if (!i || p.y > maxY) maxY = p.y;
			    }
			    var width = maxX - minX;
			    var height = maxY - minY;
			    //INIT GRID
			    var sampleWidth = Math.floor(width / sample);
			    var sampleHeight = Math.floor(height / sample);
			    for (var hh = 0; hh < sample; hh++) {
			      for (var ww = 0; ww < sample; ww++) {
			        var posX = minX + (ww * sampleWidth);
			        var posY = minY + (hh * sampleHeight);
			        if (qSVG.rayCasting({x: posX, y: posY}, polygon)) {
			          var found = true;
			          for (var ii = 0; ii < insideArray.length; ii++) {
			            if (qSVG.rayCasting({x: posX, y: posY}, ROOM[insideArray[ii]].coordsOutside)) {
			              found = false;
			              break;
			            }
			          }
			          if (found) {
			            grid.push({x: posX, y: posY});
			          }
			        }
			      }
			    }
			    var bestRange = 0;
			    var bestMatrix;

			    for (var matrix = 0; matrix < grid.length; matrix++) {
			      var minDistance = Infinity;
			      for (var pp = 0; pp < polygon.length-1; pp++) {
			        var scanDistance = qSVG.pDistance(grid[matrix], polygon[pp], polygon[pp+1]);
			        if (scanDistance.distance < minDistance) {
			          minDistance = scanDistance.distance;
			        }
			      }
			      if (minDistance > bestRange) {
			        bestMatrix = matrix;
			        bestRange = minDistance;
			      }
			    }
			    return grid[bestMatrix];
			  },

			  textOnDiv:  function(label, pos, styled, div) {
				  //console.log('in textOnDiv.  label, pos, styled, div: ', label, pos, styled, div);
			    if (typeof(pos) != 'undefined') {
			      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			      text.setAttributeNS(null, 'x', pos.x);
			      text.setAttributeNS(null, 'y', pos.y);
			      text.setAttribute("style","fill:"+styled.color+";font-weight:"+styled.fontWeight+";font-size:"+styled.fontSize);
			      text.setAttributeNS(null, 'text-anchor', 'middle');
			      text.textContent = label;
				  	// This check shouldn't be here
				  	//console.log("textOnDiv: div: ", div);
				  	if(div){
					  	if(typeof div == 'string'){
					  		document.getElementById(div).appendChild(text);
					  	}
					  	else{
					  		div.appendChild(text);
					  	}
				  	}
			    }
			  }
	
			};

			//----------------------- END Quick SVG LIBRARY --------------------------------------------------s
			




            var floorplanEditor = {

                wall: function(start, end, type, thick) {
                    this.thick = thick;
                    this.start = start;
                    this.end = end;
                    this.type = type;
                    this.parent = null;
                    this.child = null;
                    this.angle = 0;
                    this.equations = {};
                    this.coords = [];
                    this.backUp = false;
                },

                // RETURN OBJECTS ARRAY INDEX OF WALLS [WALL1, WALL2, n...] WALLS WITH THIS NODE, EXCEPT PARAM = OBJECT WALL
                getWallNode: function(coords, except = false) {
                    var nodes = [];
                    for (var k in WALLS) {
                        if (!isObjectsEquals(WALLS[k], except)) {
                            if (isObjectsEquals(WALLS[k].start, coords)) {
                                nodes.push({
                                    wall: WALLS[k],
                                    type: "start"
                                });
                            }
                            if (isObjectsEquals(WALLS[k].end, coords)) {
                                nodes.push({
                                    wall: WALLS[k],
                                    type: "end"
                                });
                            }
                        }
                    }
                    if (nodes.length == 0) return false;
                    else return nodes;
                },

                wallsComputing: function(WALLS, action = false) {
                    // IF ACTION == MOVE -> equation2 exist !!!!!
                    document.querySelector('#extension-floorplanner-boxwall').replaceChildren();
                    document.querySelector('#extension-floorplanner-boxArea').replaceChildren();

                    for (var vertice = 0; vertice < WALLS.length; vertice++) {
                        var wall = WALLS[vertice];
                        if (wall.parent != null) {
                            if (!isObjectsEquals(wall.parent.start, wall.start) && !isObjectsEquals(wall.parent.end, wall.start)) {
                                wall.parent = null;
                            }
                        }
                        if (wall.child != null) {
                            if (!isObjectsEquals(wall.child.start, wall.end) && !isObjectsEquals(wall.child.end, wall.end)) {
                                wall.child = null;
                            }
                        }
                    }

                    for (var vertice = 0; vertice < WALLS.length; vertice++) {
                        var wall = WALLS[vertice];
                        if (wall.parent != null) {
                            if (isObjectsEquals(wall.parent.start, wall.start)) {
                                var previousWall = wall.parent;
                                var previousWallStart = previousWall.end;
                                var previousWallEnd = previousWall.start;
                            }
                            if (isObjectsEquals(wall.parent.end, wall.start)) {
                                var previousWall = wall.parent;
                                var previousWallStart = previousWall.start;
                                var previousWallEnd = previousWall.end;
                            }
                        } else {
                            var S = floorplanEditor.getWallNode(wall.start, wall);
                            // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) S = false;
                            for (var k in S) {
                                var eqInter = floorplanEditor.createEquationFromWall(S[k].wall);
                                var angleInter = 90; // TO PASS TEST
                                if (action == "move") {
                                    angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
                                }
                                if (S[k].type == 'start' && S[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
                                    wall.parent = S[k].wall;
                                    S[k].wall.parent = wall;
                                    var previousWall = wall.parent;
                                    var previousWallStart = previousWall.end;
                                    var previousWallEnd = previousWall.start;
                                }
                                if (S[k].type == 'end' && S[k].wall.child == null && angleInter > 20 && angleInter < 160) {
                                    wall.parent = S[k].wall;
                                    S[k].wall.child = wall;
                                    var previousWall = wall.parent;
                                    var previousWallStart = previousWall.start;
                                    var previousWallEnd = previousWall.end;
                                }
                            }
                        }

                        if (wall.child != null) {
                            if (isObjectsEquals(wall.child.end, wall.end)) {
                                var nextWall = wall.child;
                                var nextWallStart = nextWall.end;
                                var nextWallEnd = nextWall.start;
                            } else {
                                var nextWall = wall.child;
                                var nextWallStart = nextWall.start;
                                var nextWallEnd = nextWall.end;
                            }
                        } else {
                            var E = floorplanEditor.getWallNode(wall.end, wall);
                            // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) E = false;
                            for (var k in E) {
                                var eqInter = floorplanEditor.createEquationFromWall(E[k].wall);
                                var angleInter = 90; // TO PASS TEST
                                if (action == "move") {
                                    angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
                                }
                                if (E[k].type == 'end' && E[k].wall.child == null && angleInter > 20 && angleInter < 160) {
                                    wall.child = E[k].wall;
                                    E[k].wall.child = wall;
                                    var nextWall = wall.child;
                                    var nextWallStart = nextWall.end;
                                    var nextWallEnd = nextWall.start;
                                }
                                if (E[k].type == 'start' && E[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
                                    wall.child = E[k].wall;
                                    E[k].wall.parent = wall;
                                    var nextWall = wall.child;
                                    var nextWallStart = nextWall.start;
                                    var nextWallEnd = nextWall.end;
                                }
                            }
                        }

                        var angleWall = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
                        wall.angle = angleWall;
                        var wallThickX = (wall.thick / 2) * Math.sin(angleWall);
                        var wallThickY = (wall.thick / 2) * Math.cos(angleWall);
                        var eqWallUp = qSVG.createEquation(wall.start.x + wallThickX, wall.start.y - wallThickY, wall.end.x + wallThickX, wall.end.y - wallThickY);
                        var eqWallDw = qSVG.createEquation(wall.start.x - wallThickX, wall.start.y + wallThickY, wall.end.x - wallThickX, wall.end.y + wallThickY);
                        var eqWallBase = qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                        wall.equations = {
                            up: eqWallUp,
                            down: eqWallDw,
                            base: eqWallBase
                        };
                        var dWay;

                        // WALL STARTED
                        if (wall.parent == null) {
                            var eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
                            var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
                            var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
                            wall.coords = [interUp, interDw];
                            dWay = "M" + interUp.x + "," + interUp.y + " L" + interDw.x + "," + interDw.y + " ";
                        } else {
                            var eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
                            // var previousWall = wall.parent;
                            //   var previousWallStart = previousWall.start;
                            //   var previousWallEnd = previousWall.end;
                            var anglePreviousWall = Math.atan2(previousWallEnd.y - previousWallStart.y, previousWallEnd.x - previousWallStart.x);
                            var previousWallThickX = (previousWall.thick / 2) * Math.sin(anglePreviousWall);
                            var previousWallThickY = (previousWall.thick / 2) * Math.cos(anglePreviousWall);
                            var eqPreviousWallUp = qSVG.createEquation(previousWallStart.x + previousWallThickX, previousWallStart.y - previousWallThickY, previousWallEnd.x + previousWallThickX, previousWallEnd.y - previousWallThickY);
                            var eqPreviousWallDw = qSVG.createEquation(previousWallStart.x - previousWallThickX, previousWallStart.y + previousWallThickY, previousWallEnd.x - previousWallThickX, previousWallEnd.y + previousWallThickY);
                            if (Math.abs(anglePreviousWall - angleWall) > 0.09) {
                                var interUp = qSVG.intersectionOfEquations(eqWallUp, eqPreviousWallUp, "object");
                                var interDw = qSVG.intersectionOfEquations(eqWallDw, eqPreviousWallDw, "object");

                                if (eqWallUp.A == eqPreviousWallUp.A) {
                                    interUp = {
                                        x: wall.start.x + wallThickX,
                                        y: wall.start.y - wallThickY
                                    };
                                    interDw = {
                                        x: wall.start.x - wallThickX,
                                        y: wall.start.y + wallThickY
                                    };
                                }

                                var miter = qSVG.gap(interUp, {
                                    x: previousWallEnd.x,
                                    y: previousWallEnd.y
                                });
                                if (miter > 1000) {
                                    var interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
                                    var interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
                                }
                            }
                            if (Math.abs(anglePreviousWall - angleWall) <= 0.09) {
                                var interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
                                var interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
                            }
                            wall.coords = [interUp, interDw];
                            dWay = "M" + interUp.x + "," + interUp.y + " L" + interDw.x + "," + interDw.y + " ";
                        }

                        // WALL FINISHED
                        if (wall.child == null) {
                            var eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
                            var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
                            var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
                            wall.coords.push(interDw, interUp);
                            dWay = dWay + "L" + interDw.x + "," + interDw.y + " L" + interUp.x + "," + interUp.y + " Z";
                        } else {
                            var eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
                            // var nextWall = wall.child;
                            //   var nextWallStart = nextWall.start;
                            //   var nextWallEnd = nextWall.end;
                            var angleNextWall = Math.atan2(nextWallEnd.y - nextWallStart.y, nextWallEnd.x - nextWallStart.x);
                            var nextWallThickX = (nextWall.thick / 2) * Math.sin(angleNextWall);
                            var nextWallThickY = (nextWall.thick / 2) * Math.cos(angleNextWall);
                            var eqNextWallUp = qSVG.createEquation(nextWallStart.x + nextWallThickX, nextWallStart.y - nextWallThickY, nextWallEnd.x + nextWallThickX, nextWallEnd.y - nextWallThickY);
                            var eqNextWallDw = qSVG.createEquation(nextWallStart.x - nextWallThickX, nextWallStart.y + nextWallThickY, nextWallEnd.x - nextWallThickX, nextWallEnd.y + nextWallThickY);
                            if (Math.abs(angleNextWall - angleWall) > 0.09) {
                                var interUp = qSVG.intersectionOfEquations(eqWallUp, eqNextWallUp, "object");
                                var interDw = qSVG.intersectionOfEquations(eqWallDw, eqNextWallDw, "object");

                                if (eqWallUp.A == eqNextWallUp.A) {
                                    interUp = {
                                        x: wall.end.x + wallThickX,
                                        y: wall.end.y - wallThickY
                                    };
                                    interDw = {
                                        x: wall.end.x - wallThickX,
                                        y: wall.end.y + wallThickY
                                    };
                                }

                                var miter = qSVG.gap(interUp, {
                                    x: nextWallStart.x,
                                    y: nextWallStart.y
                                });
                                if (miter > 1000) {
                                    var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
                                    var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
                                }
                            }
                            if (Math.abs(angleNextWall - angleWall) <= 0.09) {
                                var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
                                var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
                            }

                            wall.coords.push(interDw, interUp);
                            dWay = dWay + "L" + interDw.x + "," + interDw.y + " L" + interUp.x + "," + interUp.y + " Z";
                        }

                        wall.graph = floorplanEditor.makeWall(dWay);
                        document.querySelector('#extension-floorplanner-boxwall').append(wall.graph);
                    }
                },

                makeWall: function(way) {
                    var wallScreen = qSVG.create('none', 'path', {
                        d: way,
                        stroke: "none",
                        fill: colorWall,
                        "stroke-width": 1,
                        "stroke-linecap": "butt",
                        "stroke-linejoin": "miter",
                        "stroke-miterlimit": 4,
                        "fill-rule": "nonzero"
                    });
                    return wallScreen;
                },

                invisibleWall: function(wallToInvisble = false) {
                    if (!wallToInvisble) wallToInvisble = binder.wall;
                    var objWall = floorplanEditor.objFromWall(wallBind);
                    if (objWall.length == 0) {
                        wallToInvisble.type = "separate";
                        wallToInvisble.backUp = wallToInvisble.thick;
                        wallToInvisble.thick = 0.07;
                        floorplanEditor.architect(WALLS);
                        mode = "select_mode";
                        document.querySelector('#extension-floorplanner-panel').style.display = 'block';
                        floorplanSave();
                        return true;
                    } else {
                        document.querySelector('#extension-floorplanner-boxinfo').innerHTML = 'Walls containing doors or windows cannot be a separation';
                        return false;
                    }
                },

                visibleWall: function(wallToInvisble = false) {
                    if (!wallToInvisble) wallToInvisble = binder.wall;
                    wallToInvisble.type = "normal";
                    wallToInvisble.thick = wallToInvisble.backUp;
                    wallToInvisble.backUp = false;
                    floorplanEditor.architect(WALLS);
                    mode = "select_mode";
                    document.querySelector('#extension-floorplanner-panel').style.display = 'block';
                    floorplanSave();
                    return true;
                },

                architect: function(WALLS) {
                    floorplanEditor.wallsComputing(WALLS);
                    Rooms = qSVG.polygonize(WALLS);
                    document.querySelector('#extension-floorplanner-boxRoom').replaceChildren();
                    document.querySelector('#extension-floorplanner-boxSurface').replaceChildren();
                    floorplanEditor.roomMaker(Rooms);
                    return true;
                },

                splitWall: function(wallToSplit = false) {
                    if (!wallToSplit) wallToSplit = binder.wall;
                    var eqWall = floorplanEditor.createEquationFromWall(wallToSplit);
                    var wallToSplitLength = qSVG.gap(wallToSplit.start, wallToSplit.end);
                    var newWalls = [];
                    for (var k in WALLS) {
                        var eq = floorplanEditor.createEquationFromWall(WALLS[k]);
                        var inter = qSVG.intersectionOfEquations(eqWall, eq, 'obj');
                        if (qSVG.btwn(inter.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(inter.y, binder.wall.start.y, binder.wall.end.y, 'round') && qSVG.btwn(inter.x, WALLS[k].start.x, WALLS[k].end.x, 'round') && qSVG.btwn(inter.y, WALLS[k].start.y, WALLS[k].end.y, 'round')) {
                            var distance = qSVG.gap(wallToSplit.start, inter);
                            if (distance > 5 && distance < wallToSplitLength) newWalls.push({
                                distance: distance,
                                coords: inter
                            });
                        }
                    }
                    newWalls.sort(function(a, b) {
                        return (a.distance - b.distance).toFixed(2);
                    });
                    var initCoords = wallToSplit.start;
                    var initThick = wallToSplit.thick;
                    // CLEAR THE WALL BEFORE PIECES RE-BUILDER
                    for (var k in WALLS) {
                        if (isObjectsEquals(WALLS[k].child, wallToSplit)) WALLS[k].child = null;
                        if (isObjectsEquals(WALLS[k].parent, wallToSplit)) {
                            WALLS[k].parent = null;
                        }
                    }
                    WALLS.splice(WALLS.indexOf(wallToSplit), 1);
                    var wall;
                    for (var k in newWalls) {
                        wall = new floorplanEditor.wall(initCoords, newWalls[k].coords, "normal", initThick);
                        WALLS.push(wall);
                        wall.child = WALLS[WALLS.length];
                        initCoords = newWalls[k].coords;
                    }
                    // LAST WALL ->
                    wall = new floorplanEditor.wall(initCoords, wallToSplit.end, "normal", initThick);
                    WALLS.push(wall);
                    floorplanEditor.architect(WALLS);
                    mode = "select_mode";
                    document.querySelector('#extension-floorplanner-panel').style.display = 'block';
                    floorplanSave();
                    return true;
                },

                nearWallNode: function(snap, range = Infinity, except = ['']) {
                    var best;
                    var bestWall;
                    var scan;
                    var i = 0;
                    var scanDistance;
                    var bestDistance = Infinity;
                    for (var k = 0; k < WALLS.length; k++) {
                        if (except.indexOf(WALLS[k]) == -1) {
                            let scanStart = WALLS[k].start;
                            let scanEnd = WALLS[k].end;
                            scanDistance = qSVG.measure(scanStart, snap);
                            if (scanDistance < bestDistance) {
                                best = scanStart;
                                bestDistance = scanDistance;
                                bestWall = k;
                            }
                            scanDistance = qSVG.measure(scanEnd, snap);
                            if (scanDistance < bestDistance) {
                                best = scanEnd;
                                bestDistance = scanDistance;
                                bestWall = k;
                            }
                        }
                    }
                    if (bestDistance <= range) {
                        return ({
                            x: best.x,
                            y: best.y,
                            bestWall: bestWall
                        });
                    } else {
                        return false;
                    }
                },

                // USING WALLS SUPER WALL OBJECTS ARRAY
                rayCastingWall: function(snap) {
                    var wallList = [];
                    for (var i = 0; i < WALLS.length; i++) {
                        var polygon = [];
                        for (var pp = 0; pp < 4; pp++) {
                            polygon.push({
                                x: WALLS[i].coords[pp].x,
                                y: WALLS[i].coords[pp].y
                            }); // FOR Z
                        }
                        if (qSVG.rayCasting(snap, polygon)) {
                            wallList.push(WALLS[i]); // Return EDGES Index
                        }
                    }
                    if (wallList.length == 0) return false;
                    else {
                        if (wallList.length == 1) return wallList[0];
                        else return wallList;
                    }
                },

                stickOnWall: function(snap) {
                    if (WALLS.length == 0) return false;
                    var wallDistance = Infinity;
                    var wallSelected = {};
                    var result;
                    if (WALLS.length == 0) return false;
                    for (var e = 0; e < WALLS.length; e++) {
                        var eq1 = qSVG.createEquation(WALLS[e].coords[0].x, WALLS[e].coords[0].y, WALLS[e].coords[3].x, WALLS[e].coords[3].y);
                        result1 = qSVG.nearPointOnEquation(eq1, snap);
                        var eq2 = qSVG.createEquation(WALLS[e].coords[1].x, WALLS[e].coords[1].y, WALLS[e].coords[2].x, WALLS[e].coords[2].y);
                        result2 = qSVG.nearPointOnEquation(eq2, snap);
                        if (result1.distance < wallDistance && qSVG.btwn(result1.x, WALLS[e].coords[0].x, WALLS[e].coords[3].x) && qSVG.btwn(result1.y, WALLS[e].coords[0].y, WALLS[e].coords[3].y)) {
                            wallDistance = result1.distance;
                            wallSelected = {
                                wall: WALLS[e],
                                x: result1.x,
                                y: result1.y,
                                distance: result1.distance
                            };
                        }
                        if (result2.distance < wallDistance && qSVG.btwn(result2.x, WALLS[e].coords[1].x, WALLS[e].coords[2].x) && qSVG.btwn(result2.y, WALLS[e].coords[1].y, WALLS[e].coords[2].y)) {
                            wallDistance = result2.distance;
                            wallSelected = {
                                wall: WALLS[e],
                                x: result2.x,
                                y: result2.y,
                                distance: result2.distance
                            };
                        }
                    }
                    var vv = floorplanEditor.nearVertice(snap);
                    if (vv.distance < wallDistance) {
                        var eq1 = qSVG.createEquation(vv.number.coords[0].x, vv.number.coords[0].y, vv.number.coords[3].x, vv.number.coords[3].y);
                        result1 = qSVG.nearPointOnEquation(eq1, vv);
                        var eq2 = qSVG.createEquation(vv.number.coords[1].x, vv.number.coords[1].y, vv.number.coords[2].x, vv.number.coords[2].y);
                        result2 = qSVG.nearPointOnEquation(eq2, vv);
                        if (result1.distance < wallDistance && qSVG.btwn(result1.x, vv.number.coords[0].x, vv.number.coords[3].x) && qSVG.btwn(result1.y, vv.number.coords[0].y, vv.number.coords[3].y)) {
                            wallDistance = result1.distance;
                            wallSelected = {
                                wall: vv.number,
                                x: result1.x,
                                y: result1.y,
                                distance: result1.distance
                            };
                        }
                        if (result2.distance < wallDistance && qSVG.btwn(result2.x, vv.number.coords[1].x, vv.number.coords[2].x) && qSVG.btwn(result2.y, vv.number.coords[1].y, vv.number.coords[2].y)) {
                            wallDistance = result2.distance;
                            wallSelected = {
                                wall: vv.number,
                                x: result2.x,
                                y: result2.y,
                                distance: result2.distance
                            };
                        }
                    }
                    return wallSelected;
                },


                // RETURN OBJDATA INDEX LIST FROM AN WALL
                objFromWall: function(wall, typeObj = false) {
                    //console.log("objFromWall:  wall,typeObj: ", wall,typeObj);
                    var objList = [];
                    for (var scan = 0; scan < OBJDATA.length; scan++) {
                        var search;
                        if (OBJDATA[scan].family == 'inWall') {
                            try {
                                var eq = qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                                search = qSVG.nearPointOnEquation(eq, OBJDATA[scan]);
                                if (search.distance < 0.01 && qSVG.btwn(OBJDATA[scan].x, wall.start.x, wall.end.x) && qSVG.btwn(OBJDATA[scan].y, wall.start.y, wall.end.y)) objList.push(OBJDATA[scan]);
                                // WARNING 0.01 TO NO COUNT OBJECT ON LIMITS OF THE EDGE !!!!!!!!!!!! UGLY CODE( MOUSE PRECISION)
                                // TRY WITH ANGLE MAYBE ???
                            } catch (e) {
                                console.warn("floorplanEditor.js: objFromWall: error: ", e)
                            }

                        }
                    }
                    return objList;
                },

                createEquationFromWall: function(wall) {
                    return qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                },

                // WALLS SUPER ARRAY
                rayCastingWalls: function(snap) {
                    var wallList = [];
                    for (var i = 0; i < WALLS.length; i++) {
                        var polygon = [];
                        for (var pp = 0; pp < 4; pp++) {
                            polygon.push({
                                x: WALLS[i].coords[pp].x,
                                y: WALLS[i].coords[pp].y
                            }); // FOR Z
                        }
                        if (qSVG.rayCasting(snap, polygon)) {
                            wallList.push(WALLS[i]); // Return EDGES Index
                        }
                    }
                    if (wallList.length == 0) return false;
                    else {
                        if (wallList.length == 1) return wallList[0];
                        else return wallList;
                    }
                },

                inWallRib2: function(wall, option = false) {
                    if (!option) document.querySelector('#extension-floorplanner-boxRib').replaceChildren();
                    let ribMaster = [];
                    var emptyArray = [];
                    ribMaster.push(emptyArray);
                    ribMaster.push(emptyArray);
                    var inter;
                    var distance;
                    var cross;
                    var angleTextValue = wall.angle * (180 / Math.PI);
                    var objWall = floorplanEditor.objFromWall(wall); // LIST OBJ ON EDGE
                    ribMaster[0].push({
                        wall: wall,
                        crossObj: false,
                        side: 'up',
                        coords: wall.coords[0],
                        distance: 0
                    });
                    ribMaster[1].push({
                        wall: wall,
                        crossObj: false,
                        side: 'down',
                        coords: wall.coords[1],
                        distance: 0
                    });
                    for (var ob in objWall) {
                        var objTarget = objWall[ob];
                        objTarget.up = [
                            qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[0]),
                            qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[1])
                        ];
                        objTarget.down = [
                            qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[0]),
                            qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[1])
                        ];

                        distance = qSVG.measure(wall.coords[0], objTarget.up[0]) / meter;
                        ribMaster[0].push({
                            wall: wall,
                            crossObj: ob,
                            side: 'up',
                            coords: objTarget.up[0],
                            distance: distance.toFixed(2)
                        });
                        distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
                        ribMaster[0].push({
                            wall: wall,
                            crossObj: ob,
                            side: 'up',
                            coords: objTarget.up[1],
                            distance: distance.toFixed(2)
                        });
                        distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
                        ribMaster[1].push({
                            wall: wall,
                            crossObj: ob,
                            side: 'down',
                            coords: objTarget.down[0],
                            distance: distance.toFixed(2)
                        });
                        distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
                        ribMaster[1].push({
                            wall: wall,
                            crossObj: ob,
                            side: 'down',
                            coords: objTarget.down[1],
                            distance: distance.toFixed(2)
                        });
                    }
                    distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
                    ribMaster[0].push({
                        wall: wall,
                        crossObj: false,
                        side: 'up',
                        coords: wall.coords[3],
                        distance: distance
                    });
                    distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
                    ribMaster[1].push({
                        wall: wall,
                        crossObj: false,
                        side: 'down',
                        coords: wall.coords[2],
                        distance: distance
                    });
                    ribMaster[0].sort(function(a, b) {
                        return (a.distance - b.distance).toFixed(2);
                    });
                    ribMaster[1].sort(function(a, b) {
                        return (a.distance - b.distance).toFixed(2);
                    });
                    for (var t in ribMaster) {
                        for (var n = 1; n < ribMaster[t].length; n++) {
                            var found = true;
                            var shift = -5;
                            var valueText = Math.abs(ribMaster[t][n - 1].distance - ribMaster[t][n].distance);
                            var angleText = angleTextValue;
                            if (found) {
                                if (ribMaster[t][n - 1].side == 'down') {
                                    shift = -shift + 10;
                                }
                                if (angleText > 89 || angleText < -89) {
                                    angleText -= 180;
                                    if (ribMaster[t][n - 1].side == 'down') {
                                        shift = -5;
                                    } else shift = -shift + 10;
                                }

                                sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                var startText = qSVG.middle(ribMaster[t][n - 1].coords.x, ribMaster[t][n - 1].coords.y, ribMaster[t][n].coords.x, ribMaster[t][n].coords.y);
                                sizeText[n].setAttributeNS(null, 'x', startText.x);
                                sizeText[n].setAttributeNS(null, 'y', (startText.y) + shift);
                                sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
                                sizeText[n].setAttributeNS(null, 'font-family', 'roboto');
                                sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
                                sizeText[n].textContent = valueText.toFixed(2);
                                if (sizeText[n].textContent < 1) {
                                    sizeText[n].setAttributeNS(null, 'font-size', '0.8em');
                                    sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
                                } else sizeText[n].setAttributeNS(null, 'font-size', '1em');
                                sizeText[n].setAttributeNS(null, 'stroke-width', '0.4px');
                                sizeText[n].setAttributeNS(null, 'fill', '#666666');
                                sizeText[n].setAttribute("transform", "rotate(" + angleText + " " + startText.x + "," + (startText.y) + ")");

                                document.querySelector('#extension-floorplanner-boxRib').append(sizeText[n]);
                            }
                        }
                    }
                },

                // value can be "text label", "step number in stair", etc...
                obj2D: function(family, classe, type, pos, angle, angleSign, size, hinge = 'normal', thick, value, load = false) {
                    //console.log("obj2D load, classe, type:", load,',',classe,',',type);
                    //console.log("obj2D size, thick, value:", size, thick, value);
                    this.family = family // inWall, stick, collision, free
                    this.class = classe; // door, window, energy, stair, measure, text ?
                    this.type = type; // simple, double, simpleSlide, aperture, doubleSlide, fixed, switch, lamp....
                    this.x = pos.x;
                    this.y = pos.y;
                    this.angle = angle;
                    this.angleSign = angleSign;
                    this.limit = [];
                    this.hinge = hinge; // normal, reverse
                    this.graph = qSVG.create('none', 'g');
                    this.scale = {
                        x: 1,
                        y: 1
                    };
                    if (typeof xscale != 'undefined' && typeof yscale != 'undefined') {
                        this.scale = {
                            x: xscale,
                            y: yscale
                        };
                    }
                    this.value = value;
                    //console.log("obj2D: provided size: ", size);
                    this.size = size;
                    this.thick = thick;

                    //this.width = (this.size / meter).toFixed(2);
                    //this.height = (this.thick / meter).toFixed(2);

                    if (this.class == 'measure') {
                        this.width = this.size; //(this.size / meter).toFixed(2);
                        this.height = this.thick; //(this.thick / meter).toFixed(2);
                    } else {
                        this.width = (this.size / meter).toFixed(2);
                        this.height = (this.thick / meter).toFixed(2);
                    }


                    this.opacity = 1;

                    if (classe == 'boundingBox') {

                    }

                    //console.log("floorplanEditor: obj2D: init: calling cc with:  classe, type, size, thick, value", classe, type, size, thick, value);
                    var cc = carpentryCalc(classe, type, size, thick, value);
                    //console.log("floorplanEditor: obj2D: init: cc result: ", cc);
                    var blank;

                    for (var tt = 0; tt < cc.length; tt++) {
                        try {
                            //console.log(tt,": path cc[tt]: ", cc[tt]);
                        } catch (e) {
                            console.error("floorplaneditor.js: tt error: ", e);
                        }
                        //console.log("obj2D: type: ", typeof type, type);
                        if (type == 'boundingBox') {
                            //continue
                        }
                        let stroke_opacity = 1;
                        if (cc[tt].path) {
                            if (classe == 'boundingBox' || classe == 'text' || classe == 'measure') {
                                cc[tt].opacity = '1'; // not needed anymore?
                            }

                            //newpath = document.createElementNS('http://www.w3.org/2000/svg',"path"); 

                            if (type == 'boundingBox') {
                                //cc[tt].opacity = '0';
                                stroke_opacity = 0;
                            }
                            blank = qSVG.create('none', 'path', {
                                d: cc[tt].path,
                                "stroke-width": 1,
                                fill: cc[tt].fill,
                                stroke: cc[tt].stroke,
                                "stroke-opacity": stroke_opacity,
                                'class': 'path-' + type + '-' + tt,
                                'stroke-dasharray': cc[tt].strokeDashArray,
                                opacity: cc[tt].opacity
                            });
                        }
                        if (cc[tt].text) {
                            blank = qSVG.create("none", "text", {
                                x: cc[tt].x,
                                y: cc[tt].y,
                                'font-size': cc[tt].fontSize,
                                stroke: cc[tt].stroke,
                                "stroke-width": cc[tt].strokeWidth,
                                'font-family': 'sans-serif',
                                'text-anchor': 'middle',
                                'class': 'path-text-' + type + '-' + tt,
                                fill: cc[tt].fill
                            });
                            blank.textContent = cc[tt].text;
                        }
                        //console.log("blank: ", blank);

                        this.graph.append(blank);

                    } // ENDFOR
                    var bbox = this.graph.getBoundingClientRect();
                    bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
                    bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
                    bbox.origin = {
                        x: this.x,
                        y: this.y
                    };
                    this.bbox = bbox;
                    //this.realBbox = [{ x: -this.size / 2, y: -this.thick / 2 }, { x: this.size / 2, y: -this.thick / 2 }, { x: this.size / 2, y: this.thick / 2 }, { x: -this.size / 2, y: this.thick / 2 }];
                    this.realBbox = [{
                        x: -this.size / 4,
                        y: -this.thick / 4
                    }, {
                        x: this.size / 4,
                        y: -this.thick / 4
                    }, {
                        x: this.size / 4,
                        y: this.thick / 4
                    }, {
                        x: -this.size / 4,
                        y: this.thick / 4
                    }];
                    //this.realBbox = [{ x: -this.size, y: -this.thick }, { x: this.size, y: -this.thick }, { x: this.size, y: this.thick }, { x: -this.size, y: this.thick }];
                    if (family == "byObject") this.family = cc.family;
                    this.params = cc.params; // (bindBox, move, resize, rotate)

                    if (load == false && typeof cc.params.width != 'undefined') {
                        cc.params.width ? this.size = cc.params.width : this.size = size;
                        cc.params.height ? this.thick = cc.params.height : this.thick = thick;
                    } else {
                        this.size = size
                        this.thick = thick
                    }

                    //console.log("obj2D: original size and thick at end of init: ", this.size);
                    this.original_size = this.size;
                    this.original_thick = this.thick;




                    //
                    //  obj2D UPDATE
                    //

                    this.update = function() {
                        //console.log("in update. this.size, this.thick, meter: ", this.size, this.thick);
                        if (this.class == 'energy' || this.class == 'text') {
                            /*
				 			if(document.querySelector('#extension-floorplanner-tool-root.extension-floorplanner-scale-linked')){
				 				this.thick = this.size;
				 			}
							*/
                        }
                        if (this.class == 'measure') {
                            this.width = this.size; //(this.size / meter).toFixed(2);
                            this.height = this.thick; //(this.thick / meter).toFixed(2);
                        } else {
                            this.width = (this.size / meter).toFixed(2);
                            this.height = (this.thick / meter).toFixed(2);
                        }


                        //console.log("floorplanEditor: obj2D: update: calling cc with:  classe, type, size, thick, value", this.class, this.type, this.size, this.thick, this.value);
                        cc = carpentryCalc(this.class, this.type, this.size, this.thick, this.value);
                        //console.log("floorplanEditor: obj2D: update: cc result: ", cc);

                        for (var tt = 0; tt < cc.length; tt++) {
                            //console.log("tt: ", tt, cc[tt]);
                            //console.log("cc[tt]: ", cc[tt]);
                            if (cc[tt].path) {
                                //console.log("tt path exists: ", cc[tt].path);
                                //console.log("tt this.graph.querySelectorAll('path'): ", this.graph.querySelectorAll('path'));
                                //console.log("tt this.graph.querySelectorAll('path')[tt]: ", this.graph.querySelectorAll('path')[tt]);
                                try {
                                    this.graph.querySelectorAll('path')[tt].setAttribute("d", cc[tt].path);
                                } catch (e) {
                                    console.error("floorplanner: obj2D: update: could not set attribute of path: ", this.graph.querySelectorAll('path'), cc[tt].path);
                                }
                            } else {
                                //console.error("cc update would have set text now...?  cc[tt]:", cc[tt]);
                                //this.graph.find('text').context.textContent = cc[tt].text;
                                //this.graph.querySelectorAll('text')[tt].context.textContent = cc[tt].text;
                            }
                        }
                        var hingeStatus = this.hinge; // normal - reverse
                        var hingeUpdate;
                        if (hingeStatus == 'normal') hingeUpdate = 1;
                        else hingeUpdate = -1;

                        if (typeof this.x == 'undefined') {
                            console.error("floorplaneditor.js: this.x was undefined.  this: ", this);
                        }

                        if (this.class == 'energy' || this.class == 'text') { //  || this.class == 'measure'
                            //console.warn("UPDATE: this.width: ", this.width);
                            //console.warn("UPDATE: this.height: ", this.height);
                            //if(this.class != 'measure' && document.querySelector('#extension-floorplanner-scale-link-toggle-button-container').classList.contains('extension-floorplanner-scale-linked')){
                            //	this.height = this.width;
                            //}
                            this.graph.setAttribute("transform", "translate(" + (this.x) + "," + (this.y) + ") rotate(" + this.angle + ",0,0) scale(" + this.width + ", " + this.height + ")");
                            //this.graph.setAttribute("transform", "translate(" + (this.x) + "," + (this.y) + ")" );
                        } else {
                            this.graph.setAttribute("transform", "translate(" + (this.x) + "," + (this.y) + ") rotate(" + this.angle + ",0,0) scale(" + hingeUpdate + ", 1)");
                        }

                        var bbox = this.graph.getBoundingClientRect();
                        bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
                        bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
                        bbox.origin = {
                            x: this.x,
                            y: this.y
                        };
                        this.bbox = bbox;

                        /*
				       if (this.class == "text" && this.angle == 0) {
				         this.realBbox = [
				           { x: this.bbox.x, y: this.bbox.y }, { x: this.bbox.x + this.bbox.width, y: this.bbox.y }, { x: this.bbox.x + this.bbox.width, y: this.bbox.y + this.bbox.height }, { x: this.bbox.x, y: this.bbox.y + this.bbox.height }];
				         this.size = this.bbox.width;
				         this.thick = this.bbox.height;
				       }
				 		*/

                        var angleRadian = -(this.angle) * (Math.PI / 180);
                        //this.realBbox = [{ x: -this.size / 2, y: -this.thick / 2 }, { x: this.size / 2, y: -this.thick / 2 }, { x: this.size / 2, y: this.thick / 2 }, { x: -this.size / 2, y: this.thick / 2 }];
                        //this.realBbox = [{ x: -this.size / 4, y: -this.thick / 4 }, { x: this.size / 4, y: -this.thick / 4 }, { x: this.size / 4, y: this.thick / 4 }, { x: -this.size / 4, y: this.thick / 4 }];
                        this.realBbox = [{
                            x: -this.size / 3,
                            y: -this.thick / 3
                        }, {
                            x: this.size / 3,
                            y: -this.thick / 3
                        }, {
                            x: this.size / 3,
                            y: this.thick / 3
                        }, {
                            x: -this.size / 3,
                            y: this.thick / 3
                        }];

                        var newRealBbox = [{
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }];
                        newRealBbox[0].x = (this.realBbox[0].y * Math.sin(angleRadian) + this.realBbox[0].x * Math.cos(angleRadian)) + this.x;
                        newRealBbox[1].x = (this.realBbox[1].y * Math.sin(angleRadian) + this.realBbox[1].x * Math.cos(angleRadian)) + this.x;
                        newRealBbox[2].x = (this.realBbox[2].y * Math.sin(angleRadian) + this.realBbox[2].x * Math.cos(angleRadian)) + this.x;
                        newRealBbox[3].x = (this.realBbox[3].y * Math.sin(angleRadian) + this.realBbox[3].x * Math.cos(angleRadian)) + this.x;
                        newRealBbox[0].y = (this.realBbox[0].y * Math.cos(angleRadian) - this.realBbox[0].x * Math.sin(angleRadian)) + this.y;
                        newRealBbox[1].y = (this.realBbox[1].y * Math.cos(angleRadian) - this.realBbox[1].x * Math.sin(angleRadian)) + this.y;
                        newRealBbox[2].y = (this.realBbox[2].y * Math.cos(angleRadian) - this.realBbox[2].x * Math.sin(angleRadian)) + this.y;
                        newRealBbox[3].y = (this.realBbox[3].y * Math.cos(angleRadian) - this.realBbox[3].x * Math.sin(angleRadian)) + this.y;
                        this.realBbox = newRealBbox;
                        /*
                        if(this.class == 'energy' || this.class == 'text' || this.class == 'measure'){
                        	console.log("obj2D: update: at the end:")
                        	console.log("this.original_size: ", this.original_size);
                        	console.log("this.original_thick: ", this.original_thick);
                        	console.log("new this.size: ", this.size);
                        	console.log("new this.thick: ", this.thick);
                        	console.log("new this.width: ", this.width);
                        	console.log("new this.height: ", this.height);
                        	console.log("update: newRealBbox: ", newRealBbox);
                        }
                        */
                        return true;
                    }
                },

                roomMaker: function(Rooms) {
                    let globalArea = 0;
                    var oldVertexNumber = [];
                    if (Rooms.polygons.length == 0) ROOM = [];
                    for (var pp = 0; pp < Rooms.polygons.length; pp++) {
                        var foundRoom = false;
                        var roomId;
                        for (var rr = 0; rr < ROOM.length; rr++) {
                            roomId = rr;
                            var countCoords = Rooms.polygons[pp].coords.length;
                            var diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0) {
                                    countCoords = 0;
                                }
                            }
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
                                    countCoords = 0;
                                }
                            }
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length - 1) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
                                    countCoords = 0;
                                }
                            }
                            if (countCoords == 0) {
                                foundRoom = true;
                                ROOM[rr].area = Rooms.polygons[pp].area;
                                ROOM[rr].inside = Rooms.polygons[pp].inside;
                                ROOM[rr].coords = Rooms.polygons[pp].coords;
                                ROOM[rr].coordsOutside = Rooms.polygons[pp].coordsOutside;
                                ROOM[rr].way = Rooms.polygons[pp].way;
                                ROOM[rr].coordsInside = Rooms.polygons[pp].coordsInside;
                                break;
                            }
                        }
                        if (!foundRoom) {
                            ROOM.push({
                                coords: Rooms.polygons[pp].coords,
                                coordsOutside: Rooms.polygons[pp].coordsOutside,
                                coordsInside: Rooms.polygons[pp].coordsInside,
                                inside: Rooms.polygons[pp].inside,
                                way: Rooms.polygons[pp].way,
                                area: Rooms.polygons[pp].area,
                                surface: '',
                                name: '',
                                color: 'gradientWhite',
                                showSurface: true,
                                action: 'add'
                            });
                        }
                    }

                    var toSplice = [];
                    for (var rr = 0; rr < ROOM.length; rr++) {
                        var found = true;
                        for (var pp = 0; pp < Rooms.polygons.length; pp++) {
                            var countRoom = ROOM[rr].coords.length;
                            var diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0) {
                                    countRoom = 0;
                                }
                            }
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
                                    countRoom = 0;
                                }
                            }
                            if (Rooms.polygons[pp].way.length == ROOM[rr].way.length - 1) {
                                if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
                                    countRoom = 0;
                                }
                            }
                            if (countRoom == 0) {
                                found = true;
                                break;
                            } else found = false;
                        }
                        if (!found) toSplice.push(rr);
                    }

                    toSplice.sort(function(a, b) {
                        return b - a;
                    });
                    for (var ss = 0; ss < toSplice.length; ss++) {
                        ROOM.splice(toSplice[ss], 1);
                    }
                    document.querySelector('#extension-floorplanner-boxRoom').replaceChildren();
                    document.querySelector('#extension-floorplanner-boxSurface').replaceChildren();
                    document.querySelector('#extension-floorplanner-boxArea').replaceChildren();
                    for (var rr = 0; rr < ROOM.length; rr++) {

                        if (ROOM[rr].action == 'add') globalArea = globalArea + ROOM[rr].area;

                        var pathSurface = ROOM[rr].coords;
                        var pathCreate = "M" + pathSurface[0].x + "," + pathSurface[0].y;
                        for (var p = 1; p < pathSurface.length; p++) {
                            pathCreate = pathCreate + " " + "L" + pathSurface[p].x + "," + pathSurface[p].y;
                        }
                        if (ROOM[rr].inside.length > 0) {
                            for (var ins = 0; ins < ROOM[rr].inside.length; ins++) {
                                pathCreate = pathCreate + " M" + Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length - 1].x + "," + Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length - 1].y;
                                for (var free = Rooms.polygons[ROOM[rr].inside[ins]].coords.length - 2; free > -1; free--) {
                                    pathCreate = pathCreate + " L" + Rooms.polygons[ROOM[rr].inside[ins]].coords[free].x + "," + Rooms.polygons[ROOM[rr].inside[ins]].coords[free].y;
                                }
                            }
                        }
                        qSVG.create('boxRoom', 'path', {
                            d: pathCreate,
                            fill: 'url(#' + ROOM[rr].color + ')',
                            'fill-opacity': 1,
                            stroke: 'none',
                            'fill-rule': 'evenodd',
                            class: 'extension-floorplanner-room'
                        });

                        qSVG.create('boxSurface', 'path', {
                            d: pathCreate,
                            fill: '#fff',
                            'fill-opacity': 1,
                            stroke: 'none',
                            'fill-rule': 'evenodd',
                            class: 'extension-floorplanner-room'
                        });

                        var centroid = qSVG.polygonVisualCenter(ROOM[rr]);

                        if (ROOM[rr].name != '') {
                            var styled = {
                                color: '#343938'
                            };
                            if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
                            qSVG.textOnDiv(ROOM[rr].name, centroid, styled, 'extension-floorplanner-boxArea');
                        }

                        if (ROOM[rr].name != '') centroid.y = centroid.y + 20;
                        var area = ((ROOM[rr].area) / (meter * meter)).toFixed(2) + ' m²';
                        var styled = {
                            color: '#343938',
                            fontSize: '18px',
                            fontWeight: 'normal'
                        };
                        if (ROOM[rr].surface != '') {
                            styled.fontWeight = 'bold';
                            area = ROOM[rr].surface + ' m²';
                        }
                        if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
                        if (ROOM[rr].showSurface) qSVG.textOnDiv(area, centroid, styled, 'extension-floorplanner-boxArea');
                    }
                    if (globalArea <= 0) {
                        globalArea = 0;
                        document.querySelector('#extension-floorplanner-areaValue').innerHTML = '';
                    } else {
                        document.querySelector('#extension-floorplanner-areaValue').innerHTML = '' + (globalArea / 3600).toFixed(1) + ' m²';
                    }
                },

                rayCastingRoom: function(point) {
                    var x = point.x,
                        y = point.y;
                    var roomGroup = [];
                    for (var polygon = 0; polygon < ROOM.length; polygon++) {
                        var inside = qSVG.rayCasting(point, ROOM[polygon].coords);

                        if (inside) {
                            roomGroup.push(polygon);
                        }
                    }
                    if (roomGroup.length > 0) {
                        var bestArea = ROOM[roomGroup[0]].area;
                        var roomTarget;
                        for (var siz = 0; siz < roomGroup.length; siz++) {
                            if (ROOM[roomGroup[siz]].area <= bestArea) {
                                bestArea = ROOM[roomGroup[siz]].area;
                                roomTarget = ROOM[roomGroup[siz]];
                            }
                        }
                        return roomTarget;
                    } else {
                        return false;
                    }
                },

                nearVertice: function(snap, range = 10000) {
                    var bestDistance = Infinity;
                    var bestVertice;
                    for (var i = 0; i < WALLS.length; i++) {
                        var distance1 = qSVG.gap(snap, {
                            x: WALLS[i].start.x,
                            y: WALLS[i].start.y
                        });
                        var distance2 = qSVG.gap(snap, {
                            x: WALLS[i].end.x,
                            y: WALLS[i].end.y
                        });
                        if (distance1 < distance2 && distance1 < bestDistance) {
                            bestDistance = distance1;
                            bestVertice = {
                                number: WALLS[i],
                                x: WALLS[i].start.x,
                                y: WALLS[i].start.y,
                                distance: Math.sqrt(bestDistance)
                            };
                        }
                        if (distance2 < distance1 && distance2 < bestDistance) {
                            bestDistance = distance2;
                            bestVertice = {
                                number: WALLS[i],
                                x: WALLS[i].end.x,
                                y: WALLS[i].end.y,
                                distance: Math.sqrt(bestDistance)
                            };
                        }
                    }
                    if (bestDistance < range * range) return bestVertice;
                    else return false;
                },

                nearWall: function(snap, range = Infinity) {
                    var wallDistance = Infinity;
                    var wallSelected = {};
                    var result;
                    if (WALLS.length == 0) return false;
                    for (var e = 0; e < WALLS.length; e++) {
                        var eq = qSVG.createEquation(WALLS[e].start.x, WALLS[e].start.y, WALLS[e].end.x, WALLS[e].end.y);
                        result = qSVG.nearPointOnEquation(eq, snap);
                        if (result.distance < wallDistance && qSVG.btwn(result.x, WALLS[e].start.x, WALLS[e].end.x) && qSVG.btwn(result.y, WALLS[e].start.y, WALLS[e].end.y)) {
                            wallDistance = result.distance;
                            wallSelected = {
                                wall: WALLS[e],
                                x: result.x,
                                y: result.y,
                                distance: result.distance
                            };
                        }
                    }
                    var vv = floorplanEditor.nearVertice(snap);
                    if (vv.distance < wallDistance) {
                        wallDistance = vv.distance;
                        wallSelected = {
                            wall: vv.number,
                            x: vv.x,
                            y: vv.y,
                            distance: vv.distance
                        };
                    }
                    if (wallDistance <= range) return wallSelected;
                    else return false;
                },

                showScaleBox: function() {
                    if (ROOM.length > 0) {
                        var minX, minY, maxX, maxY;
                        for (var i = 0; i < WALLS.length; i++) {
                            var px = WALLS[i].start.x;
                            var py = WALLS[i].start.y;
                            if (!i || px < minX) minX = px;
                            if (!i || py < minY) minY = py;
                            if (!i || px > maxX) maxX = px;
                            if (!i || py > maxY) maxY = py;
                            var px = WALLS[i].end.x;
                            var py = WALLS[i].end.y;
                            if (!i || px < minX) minX = px;
                            if (!i || py < minY) minY = py;
                            if (!i || px > maxX) maxX = px;
                            if (!i || py > maxY) maxY = py;
                        }
                        var width = maxX - minX;
                        var height = maxY - minY;

                        var labelWidth = ((maxX - minX) / meter).toFixed(2);
                        var labelHeight = ((maxY - minY) / meter).toFixed(2);

                        var sideRight = 'm' + (maxX + 40) + ',' + minY;
                        sideRight = sideRight + ' l60,0 m-40,10 l10,-10 l10,10 m-10,-10';
                        sideRight = sideRight + ' l0,' + height;
                        sideRight = sideRight + ' m-30,0 l60,0 m-40,-10 l10,10 l10,-10';

                        sideRight = sideRight + 'M' + (minX) + ',' + (minY - 40);
                        sideRight = sideRight + ' l0,-60 m10,40 l-10,-10 l10,-10 m-10,10';
                        sideRight = sideRight + ' l' + width + ',0';
                        sideRight = sideRight + ' m0,30 l0,-60 m-10,40 l10,-10 l-10,-10';

                        document.querySelector('#extension-floorplanner-boxScale').replaceChildren();

                        qSVG.create('boxScale', 'path', {
                            d: sideRight,
                            stroke: "#555",
                            fill: "none",
                            "stroke-width": 0.3,
                            "stroke-linecap": "butt",
                            "stroke-linejoin": "miter",
                            "stroke-miterlimit": 4,
                            "fill-rule": "nonzero"
                        });

                        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        text.setAttributeNS(null, 'x', (maxX + 70));
                        text.setAttributeNS(null, 'y', ((maxY + minY) / 2) + 35);
                        text.setAttributeNS(null, 'fill', '#555');
                        text.setAttributeNS(null, 'text-anchor', 'middle');
                        text.textContent = labelHeight + ' m';
                        text.setAttribute("transform", "rotate(270 " + (maxX + 70) + "," + (maxY + minY) / 2 + ")");
                        document.querySelector('#extension-floorplanner-boxScale').append(text);

                        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        text.setAttributeNS(null, 'x', (maxX + minX) / 2);
                        text.setAttributeNS(null, 'y', (minY - 95));
                        text.setAttributeNS(null, 'fill', '#555');
                        text.setAttributeNS(null, 'text-anchor', 'middle');
                        text.textContent = labelWidth + ' m';
                        document.querySelector('#extension-floorplanner-boxScale').append(text);

                    }
                }

                // END EDITOR
            }







            document.getElementById('extension-floorplanner-new-file-empty').addEventListener("click", function(event) {
                initHistory('boot');
            });

            document.getElementById('extension-floorplanner-new-file-square').addEventListener("click", function(event) {
                initHistory('newSquare');
            });

            document.getElementById('extension-floorplanner-new-file-L').addEventListener("click", function(event) {
                initHistory('newL');
            });


            document.getElementById('extension-floorplanner-applySettings').addEventListener("click", function(event) {
                close_floorplanner_settings();
            });

            document.getElementById('extension-floorplanner-reportTools-done-button').addEventListener("click", function(event) {
                document.querySelector('#extension-floorplanner-reportTools').style.display = 'none';
                panel_el.style.display = 'block';
                mode = 'select_mode';
            });

            /*
            document.getElementById('extension-floorplanner-cutWall-button').addEventListener("click", function (event) {
            	floorplanEditor.splitWall();
            });
            */

            document.getElementById('extension-floorplanner-close-wallTools-button').addEventListener("click", function(event) {
                fonc_button('select_mode');
                box_info_el.innerHTML = '';
                document.querySelector('#extension-floorplanner-wallTools').style.display = 'none';
                panel_el.style.display = 'block';
            });




            //document.getElementById('extension-floorplanner-show-things-button').addEventListener("click", function(event) {
                //hide_submenus();
                //document.getElementById('extension-floorplanner-things-container').style.display = 'block';
			//});
			



            document.getElementById('extension-floorplanner-clone-button').addEventListener("click", function(event) {
                clone_object();
            });

            document.getElementById('extension-floorplanner-save-object-button').addEventListener("click", function(event) {
                save_object();
            });

            document.getElementById('extension-floorplanner-modify-door-button').addEventListener("click", function(event) {
                fonc_button('select_mode');
                box_info_el.innerHTML = 'Selection mode';
                document.querySelector('#extension-floorplanner-objTools').style.display = 'none';
                panel_el.style.display = 'block';
                binder.graph.remove();
                bye_binder();
                rib();
            });

            document.getElementById('extension-floorplanner-door_mode').addEventListener("click", function(event) {
                hide_submenus();
                document.getElementById('extension-floorplanner-door_list').style.display = 'block';
            });

            document.getElementById('extension-floorplanner-window_mode').addEventListener("click", function(event) {
                hide_submenus();
                document.getElementById('extension-floorplanner-window_list').style.display = 'block';
            });

            document.getElementById('extension-floorplanner-stair_mode').addEventListener("click", function(event) {
                hide_submenus();
            });

            document.getElementById('extension-floorplanner-object_mode').addEventListener("click", function(event) {
                toggle_furniture();
            });

            document.getElementById('extension-floorplanner-layer_mode').addEventListener("click", function(event) {
                toggle_layers();
            });

            document.getElementById('extension-floorplanner-save-to-floorplans').addEventListener("click", function(event) {
                save_to_floorplans();
            });

            document.getElementById('extension-floorplanner-save-as-button').addEventListener("click", function(event) {
                save_floorplan_as();
            });

            document.getElementById('extension-floorplanner-new-file-button').addEventListener("click", function(event) {
                new_floorplan();
            });

            document.getElementById('extension-floorplanner-clear-button').addEventListener("click", function(event) {
                clear_floorplan();
            });

            document.getElementById('extension-floorplanner-delete-button').addEventListener("click", function(event) {
                delete_floorplan();
            });

            document.getElementById('extension-floorplanner-start-fullscreen-button').addEventListener("click", function(event) {
                fullscreen();
                this.style.display = 'none';
                document.querySelector('#extension-floorplanner-nofull_mode').style.display = 'block';
            });

            document.getElementById('extension-floorplanner-exit-fullscreen-button').addEventListener("click", function(event) {
                outFullscreen();
                this.style.display = 'none';
                document.querySelector('#extension-floorplanner-full_mode').style.display = 'block';
            });

            document.getElementById('extension-floorplanner-show-floorplanner-settings').addEventListener("click", function(event) {
                show_floorplanner_settings();
            });

            document.getElementById('extension-floorplanner-print-button').addEventListener("click", function(event) {
                print_floorplan();
            });

            document.getElementById('extension-floorplanner-stop-floorplanner').addEventListener("click", function(event) {
                stop_floorplanner();
            });
			
            document.getElementById('extension-floorplanner-debug-button').addEventListener("click", function(event) {
                floorplanner_debug();
            });
            document.getElementById('extension-floorplanner-debug2-button').addEventListener("click", function(event) {
                clear_floorplan();
				clear_local_storage();
            });
			
            document.getElementById('floorplan-edit-button').addEventListener("click", function(event) {
                if(floorplanner_started){
                	stop_floorplanner(event);
                }
            }, true);
			
            document.getElementById('floorplan-done-button').addEventListener("click", function(event) {
                /*
				if(floorplanner_started){
                	stop_floorplanner();
                }
				*/
            });
			
            /*
            document.getElementById('extension-floorplanner-clone-button').addEventListener("click", function (event) {

            });
            
            document.getElementById('extension-floorplanner-clone-button').addEventListener("click", function (event) {

            });
            
            document.getElementById('extension-floorplanner-clone-button').addEventListener("click", function (event) {

            });
            
            document.getElementById('extension-floorplanner-clone-button').addEventListener("click", function (event) {

            });
            
            */




            let linked_scaling_container_el = document.querySelector('#extension-floorplanner-scale-link-toggle-button-container');
            document.querySelector('#extension-floorplanner-scale-link-toggle-button').addEventListener("click", function(event) {
                set_linked_scaling(!linked_scaling);
				
				if(linked_scaling){
					set_slider_scale();
				}
				/*
                if (typeof binder != 'undefined') {
                    if (typeof binder.update != 'undefined') {
                        binder.update();
                    }
                    if (typeof binder.obj != 'undefined' && typeof binder.obj.update != 'undefined') {
                        binder.obj.update();
                    }
                }
				*/
                //console.log("linked scaling is now: ", linked_scaling);
            });

            const text_modal_el = document.getElementById('extension-floorplanner-textToLayer');


            const text_suggestions_select_el = document.querySelector('#extension-floorplanner-text-suggestions-select');
            text_suggestions_select_el.addEventListener("change", function(event) {
                if (text_suggestions_select_el.selectedIndex == -1) {
                    return null;
                } else {
                    if (document.getElementById('extension-floorplanner-labelBox').value != '') {
                        document.getElementById('extension-floorplanner-labelBox').value = document.getElementById('extension-floorplanner-labelBox').value + ' ';
                    }
                    document.getElementById('extension-floorplanner-labelBox').value = document.getElementById('extension-floorplanner-labelBox').value + text_suggestions_select_el.options[text_suggestions_select_el.selectedIndex].text;
                }
            });

            document.querySelector('#extension-floorplanner-text-toggle-emojis-button').addEventListener("click", function(event) {
                if (text_modal_el.classList.contains('extension-floorplanner-hide-emojis-list')) {
                    text_modal_el.classList.remove('extension-floorplanner-hide-emojis-list');
                } else {
                    text_modal_el.classList.add('extension-floorplanner-hide-emojis-list');
                }
            });

            const emojis_list_el = document.getElementById('extension-floorplanner-text-emojis-list');
            emojis_list_el.innerHTML = '';
            for (var e = 0; e < emojis.length; e++) {
                const emoji_el = document.createElement('span');
                emoji_el.textContent = emojis[e];
                emoji_el.addEventListener("click", function(event) {
                    //emoji_el.innerText();
                    document.getElementById('extension-floorplanner-labelBox').value = document.getElementById('extension-floorplanner-labelBox').value + emoji_el.textContent;
                });
                emojis_list_el.appendChild(emoji_el);
            }


            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && settings.dark_mode == null) {
                content_el.classList.add('extension-floorplanner-dark-mode');
                document.getElementById('extension-floorplanner-dark-mode').checked = true;
            } else if (settings.dark_mode === true) {
                content_el.classList.add('extension-floorplanner-dark-mode');
                document.getElementById('extension-floorplanner-dark-mode').checked = true;
            } else if (settings.dark_mode === false) {
                //console.log("dark mode check fell through or was disabled, keeping UI in light mode");
            }



            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (settings.dark_mode == null) {
                    const newColorScheme = e.matches ? "dark" : "light";
                    if (newColorScheme == 'dark') {
                        content_el.classList.add('extension-floorplanner-dark-mode');
                        document.getElementById('extension-floorplanner-dark-mode').checked = true;
                    } else {
                        content_el.classList.remove('extension-floorplanner-dark-mode');
                        document.getElementById('extension-floorplanner-dark-mode').checked = false;
                    }
                }
            });



            function getOffset(element) {
                var bound = element.getBoundingClientRect();
                var html = document.documentElement;

                return {
                    top: bound.top + window.pageYOffset - html.clientTop,
                    left: bound.left + window.pageXOffset - html.clientLeft
                };
            }

            document.querySelector('#extension-floorplanner-title').addEventListener("click", function(event) {
                floorplanner_debug();
            });






            //
            //   ENGINE
            //


            // Make compatible with touch UI's
            if (touch_ui) {
                linElement.addEventListener("touchend", _MOUSEUP);
                linElement.addEventListener("touchmove", throttle(function(event) {
                    _MOUSEMOVE(event);
                }, 30));
                linElement.addEventListener("touchstart", _TOUCH_START, true);
            } else {
                linElement.addEventListener("mouseup", _MOUSEUP);
                linElement.addEventListener("mousemove", throttle(function(event) {
                    _MOUSEMOVE(event);
                }, 30));
                linElement.addEventListener("mousedown", _MOUSEDOWN, true);
            }

            linElement.addEventListener("click", function(event) {
                event.preventDefault();
                clear_selection();
                if (currently_editing_an_object && currently_cloning_an_object == false) {
                    save_object();
                }
            });


            panel_el.addEventListener('mousemove', function(event) {
                if ((mode == 'line_mode' || mode == 'partition_mode') && action == 1) {
                    action = 0;
                    if (typeof(binder) != 'undefined') {
                        //binder.remove();
                        //delete binder;
                        bye_binder();
                    }
                    // TODO: this check shouldn't be here
                    if (document.querySelector('#extension-floorplanner-linetemp')) {
                        document.querySelector('#extension-floorplanner-linetemp').remove();
                        document.querySelector('#extension-floorplanner-line_construc').remove();
                    }
                    lengthTemp.remove();
                    //delete lengthTemp;
                }
            });

            if (typeof window.floorplan_listeners_added == 'undefined') {
                //console.log("floorplan: engine.js: adding resize listeners");
                window.floorplan_listeners_added = true;
                window.addEventListener('resize', function(event) {
                    var rect = linElement.getBoundingClientRect(); // get the bounding rectangle
                    width_viewbox = rect.width;
                    height_viewbox = rect.height;
					adjust_sizes();
                    //console.error("!!! SETTING VIEWBOX 3: ", originX_viewbox, originY_viewbox, width_viewbox,height_viewbox);
                    //console.error("window resized.  originX_viewbox,width_viewbox: ", originX_viewbox, width_viewbox, originY_viewbox, height_viewbox);
                    document.querySelector('#extension-floorplanner-lin').setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox);
                });

                // *****************************************************************************************************
                // ******************************        KEYPRESS on KEYBOARD          *********************************
                // *****************************************************************************************************
                document.addEventListener("keydown", (event) => {
                    if (mode != "text_mode") {
                        if (event.keyCode == '37') {
                            //LEFT
                            zoom_maker('zoomleft', 100, 30);
                        }
                        if (event.keyCode == '38') {
                            //UP
                            zoom_maker('zoomtop', 100, 30);
                        }
                        if (event.keyCode == '39') {
                            //RIGHT
                            zoom_maker('zoomright', 100, 30);
                        }
                        if (event.keyCode == '40') {
                            //DOWN
                            zoom_maker('zoombottom', 100, 30);
                        }
                        if (event.keyCode == '107') {
                            //+
                            zoom_maker('zoomin', 20, 50);
                        }
                        if (event.keyCode == '109') {
                            //-
                            zoom_maker('zoomout', 20, 50);
                        }

                        if (event.key === 'Escape') {
                            //console.log("Escape keyboard press detected");
                            do_select_mode();
                        }

                        if (event.ctrlKey && event.key === 'z') {
                            //console.log("CTRL Z keyboard press detected");
                            floorplanner_undo();
                        }


                    }
                    // else {
                    //   if (action == 1) {
                    //     binder.textContent = binder.textContent + event.key;
                    //      //console.log(field.value);
                    //   }
                    // }
                });
            }




            function _TOUCH_START(event) {
                //console.log("in _TOUCH_START.  event: ", event);
                _MOUSEMOVE(event);
                _MOUSEDOWN(event);
            }


            // *****************************************************************************************************
            // ******************************        MOUSE MOVE          *******************************************
            // *****************************************************************************************************

            function _MOUSEMOVE(event) {
                //console.log("in _MOUSEMOVE. event, mode: ", event, mode);


                event.preventDefault();
				/*
                let wallNode = null;
                let wallBind = null;
				let wallStartConstruc;
				let helpConstruc;
				*/
				let addNode;

                //document.querySelector('.extension-floorplanner-sub').style.display='none';
                //console.log("ROOM: ", ROOM);
                if (typeof binder != 'undefined') {
                    //console.log("mousemove -> mode, binder: ", mode, binder);
                } else {
                    //console.log("mousemove -> mode (no binder): ", mode);
                }
                if (drag == 'on') {
                    //root_el.classList.add('extension-floorplanner-do-not-pulsate');
                } else {
                    //root_el.classList.remove('extension-floorplanner-do-not-pulsate');
                }



                //**************************************************************************
                //********************   MOUSE MOVE:   TEXT   MODE   *************************************
                //**************************************************************************
                if (mode == 'text_mode') {
                    //console.log("in text_mode. action: ", action);
                    snap = calcul_snap(event, grid_snap);
                    if (action == 0) cursor('text');
                    else {
                        cursor('none');
                    }
                }

                //**************************************************************************
                //*******************   MOUSE MOVE:   OBJECT   MODE   ************************************
                //**************************************************************************
                if (mode == 'object_mode') {
                    //console.log("---> in object mode");
                    snap = calcul_snap(event, grid_snap);
                    //console.log("---> object mode: snap: ", snap);
                    if (typeof(binder) != 'undefined') {
                        if (typeof binder.family != 'undefined') {
                            if ((binder.family != 'stick' && binder.family != 'collision') || WALLS.length == 0) {
                                //console.log("object mode: not stick/collision type, and walls length is 0")
                                //console.log("binder: ", binder);
                                binder.x = snap.x;
                                binder.y = snap.y;
                                binder.oldX = binder.x;
                                binder.oldY = binder.y;
                                binder.update();
                            }

                            if (binder.family == 'collision') {
                                var found = false;

                                if (floorplanEditor.rayCastingWalls({
                                        x: binder.bbox.left,
                                        y: binder.bbox.top
                                    })) found = true;
                                if (!found && floorplanEditor.rayCastingWalls({
                                        x: binder.bbox.left,
                                        y: binder.bbox.bottom
                                    })) found = true;
                                if (!found && floorplanEditor.rayCastingWalls({
                                        x: binder.bbox.right,
                                        y: binder.bbox.top
                                    })) found = true;
                                if (!found && floorplanEditor.rayCastingWalls({
                                        x: binder.bbox.right,
                                        y: binder.bbox.bottom
                                    })) found = true;

                                if (!found) {
                                    binder.x = snap.x;
                                    binder.y = snap.y;
                                    binder.oldX = binder.x;
                                    binder.oldY = binder.y;
                                    binder.update();
                                } else {
                                    binder.x = binder.oldX;
                                    binder.y = binder.oldY;
                                    binder.update();
                                }
                            }
                            if (binder.family == 'stick') {
                                pos = floorplanEditor.stickOnWall(snap);
                                binder.oldX = pos.x;
                                binder.oldY = pos.y;
                                var angleWall = qSVG.angleDeg(pos.wall.start.x, pos.wall.start.y, pos.wall.end.x, pos.wall.end.y);
                                var v1 = qSVG.vectorXY({
                                    x: pos.wall.start.x,
                                    y: pos.wall.start.y
                                }, {
                                    x: pos.wall.end.x,
                                    y: pos.wall.end.y
                                });
                                var v2 = qSVG.vectorXY({
                                    x: pos.wall.end.x,
                                    y: pos.wall.end.y
                                }, snap);
                                binder.x = pos.x - Math.sin(pos.wall.angle * (360 / 2 * Math.PI)) * binder.thick / 2;
                                binder.y = pos.y - Math.cos(pos.wall.angle * (360 / 2 * Math.PI)) * binder.thick / 2;
                                var newAngle = qSVG.vectorDeter(v1, v2);
                                if (Math.sign(newAngle) == 1) {
                                    angleWall += 180;
                                    binder.x = pos.x + Math.sin(pos.wall.angle * (360 / 2 * Math.PI)) * binder.thick / 2;
                                    binder.y = pos.y + Math.cos(pos.wall.angle * (360 / 2 * Math.PI)) * binder.thick / 2;
                                }
                                binder.angle = angleWall;
                                binder.update();
                            }
                        } else {
                            //console.log("binder, but no family");
                        }

                    } else {
                        /*
                        if(document.querySelector('#extension-floorplanner-object_list')){
                            document.querySelector('#extension-floorplanner-object_list').style.display='none';
                        }
                        */
                        if (modeOption == 'simpleStair') binder = new floorplanEditor.obj2D("free", "stair", "simpleStair", snap, 0, 0, 0, "normal", 0, 15);
                        else {
                            var typeObj = modeOption;
                            binder = new floorplanEditor.obj2D("free", "energy", typeObj, snap, 0, 0, 0, "normal", 0);
                        }

                        document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);

                    }
                }

                //**************************************************************************
                //**************        MOUSE MOVE:   DISTANCE MODE   ************************************
                //**************************************************************************
                if (mode == 'distance_mode') {
                    //console.log("distance_mode");
                    snap = calcul_snap(event, grid_snap);
                    if (typeof(binder) == 'undefined') {
                        let cross = qSVG.create("boxbind", "path", {
                            d: "M-3000,0 L3000,0 M0,-3000 L0,3000",
                            "stroke-width": 0.5,
                            "stroke-opacity": "0.8",
                            stroke: "#e2b653",
                            fill: "#e2b653"
                        });
                        binder = new floorplanEditor.obj2D("free", "measure", "", {
                            x: 0,
                            y: 0
                        }, 0, 0, 0, "normal", 0, "");
                        let labelMeasure = qSVG.create("none", "text", {
                            x: 0,
                            y: -10,
                            'font-size': '1.2em',
                            stroke: "#ffffff",
                            "stroke-width": "0.4px",
                            'font-family': 'sans-serif',
                            'text-anchor': 'middle',
                            fill: "#3672d9"
                        });
                        binder.graph.append(labelMeasure);
                        document.querySelector('g#extension-floorplanner-boxbind').append(binder.graph);
                        //document.querySelector('#extension-floorplanner-boxMeasure').append(cross);
                        //document.querySelector('#extension-floorplanner-boxMeasure').append(binder.graph);
                    } else {
                        //console.log("distance_mode: binder was already defined. cross,labelMeasure: ", cross,labelMeasure);
                        x = snap.x;
                        y = snap.y;
                        cross.setAttribute(
                            "transform", "translate(" + (snap.x) + "," + (snap.y) + ")"
                        );
                        if (action == 1) {
                            var startText = qSVG.middle(pox, poy, x, y);
                            var angleText = qSVG.angle(pox, poy, x, y);
                            var valueText = qSVG.measure({
                                x: pox,
                                y: poy
                            }, {
                                x: x,
                                y: y
                            });
                            //console.log("measure: valueText: ", valueText);
                            binder.size = valueText;
                            binder.x = startText.x;
                            binder.y = startText.y;
                            binder.angle = angleText.deg;
                            valueText = (valueText / meter).toFixed(2) + ' m';
                            //labelMeasure.context.textContent = valueText;
                            labelMeasure.textContent = valueText;

                            binder.update();
                        }
                    }
                }

                //**************************************************************************
                //**************      MOUSE MOVE:     ROOM MODE *****************************************
                //**************************************************************************

                if (mode == 'room_mode') {
                    //console.log("in room_mode");
                    snap = calcul_snap(event, grid_snap);
                    var roomTarget;
                    if (roomTarget = floorplanEditor.rayCastingRoom(snap)) {
                        if (typeof(binder) != 'undefined') {
                            //binder.remove();
                            //delete binder;
                            bye_binder();
                        }

                        var pathSurface = roomTarget.coords;
                        var pathCreate = "M" + pathSurface[0].x + "," + pathSurface[0].y;
                        for (var p = 1; p < pathSurface.length - 1; p++) {
                            pathCreate = pathCreate + " " + "L" + pathSurface[p].x + "," + pathSurface[p].y;
                        }
                        pathCreate = pathCreate + "Z";

                        if (roomTarget.inside.length > 0) {
                            for (var ins = 0; ins < roomTarget.inside.length; ins++) {
                                pathCreate = pathCreate + " M" + Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length - 1].x + "," + Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length - 1].y;
                                for (var free = Rooms.polygons[roomTarget.inside[ins]].coords.length - 2; free > -1; free--) {
                                    pathCreate = pathCreate + " L" + Rooms.polygons[roomTarget.inside[ins]].coords[free].x + "," + Rooms.polygons[roomTarget.inside[ins]].coords[free].y;
                                }
                            }
                        }
                        //console.warn("room_mode: SETTING BINDER AS SVG..");
                        binder = qSVG.create('boxbind', 'path', {
                            id: "extension-floorplanner-roomSelected",
                            d: pathCreate,
                            fill: '#c9c14c',
                            'fill-opacity': 1,
                            stroke: '#c9c14c',
                            'fill-rule': 'evenodd',
                            'stroke-width': 3
                        });
                        binder.type = 'room';
                        binder.area = roomTarget.area;
                        binder.id = ROOM.indexOf(roomTarget);
                    } else {
                        if (typeof(binder) != 'undefined') {
                            //binder.remove();
                            //delete binder;
                            bye_binder();
                        }
                    }
                }

                //**************************************************************************
                //**************        MOUSE MOVE:   DOOR/WINDOW MODE   *********************************
                //**************************************************************************

                if (mode == 'door_mode') {
                    //console.log("in door_mode");

                    if (typeof(binder) != 'undefined' && typeof binder.update != 'undefined') {
                        if (binder.class == "boundingBox") {
                            bye_binder();
                        }
                    }

                    snap = calcul_snap(event, grid_snap);
                    //console.log("--snap: ", snap)
                    if (wallSelect = floorplanEditor.nearWall(snap)) {
                        //console.log("--door_mode: got wall to snap to: ", wallSelect);
                        var wall = wallSelect.wall;
                        if (wall.type != 'separate') {
                            //console.log("-- wall type is not separate: ", wall.type);
                            if (typeof(binder) != 'undefined' && typeof binder.update != 'undefined') {
                                //console.log("--door_mode: binder already existed: ", binder);
                                var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                                var v1 = qSVG.vectorXY({
                                    x: wall.start.x,
                                    y: wall.start.y
                                }, {
                                    x: wall.end.x,
                                    y: wall.end.y
                                });
                                var v2 = qSVG.vectorXY({
                                    x: wall.end.x,
                                    y: wall.end.y
                                }, snap);
                                var newAngle = qSVG.vectorDeter(v1, v2);
                                binder.angleSign = 0;
                                if (Math.sign(newAngle) == 1) {
                                    binder.angleSign = 1;
                                    angleWall += 180;
                                }

                                var limits = limitObj(wall.equations.base, binder.size, wallSelect);
                                if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                                    binder.x = wallSelect.x;
                                    binder.y = wallSelect.y;
                                    binder.angle = angleWall;
                                    binder.thick = wall.thick;
                                    binder.limit = limits;
                                    binder.update();
                                }

                                if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
                                    if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
                                        binder.x = limits[0].x;
                                        binder.y = limits[0].y;
                                    }
                                    if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                                        binder.x = limits[1].x;
                                        binder.y = limits[1].y;
                                    }
                                    binder.limit = limits;
                                    binder.angle = angleWall;
                                    binder.thick = wall.thick;
                                    binder.update();
                                }
                            } else {
                                //console.log("-- binder is undefined, making doorWindow object.  modeOption, wallSelect,wall.thick:", modeOption, wallSelect,wall.thick);
                                // family, classe, type, pos, angle, angleSign, size, hinge, thick 
                                binder = new floorplanEditor.obj2D("inWall", "doorWindow", modeOption, wallSelect, 0, 0, 60, "normal", wall.thick);
                                //console.log("new door binder, should be obj2D: ", binder);
                                var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                                //console.log("angleWall: ", angleWall);
                                var v1 = qSVG.vectorXY({
                                    x: wall.start.x,
                                    y: wall.start.y
                                }, {
                                    x: wall.end.x,
                                    y: wall.end.y
                                });
                                var v2 = qSVG.vectorXY({
                                    x: wall.end.x,
                                    y: wall.end.y
                                }, snap);
                                var newAngle = qSVG.vectorDeter(v1, v2);
                                //console.log("newAngle: ", newAngle);
                                if (Math.sign(newAngle) == 1) {
                                    angleWall += 180;
                                    binder.angleSign = 1;
                                }
                                var startCoords = qSVG.middle(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                                //console.log("startCoords: ", startCoords);
                                binder.x = startCoords.x;
                                binder.y = startCoords.y;
                                binder.angle = angleWall;
                                binder.update();
                                //console.log("door mode: appending binder.graph: ", binder.graph);
                                document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
                            }
                        }
                    } else {
                        if (typeof(binder) != 'undefined') {
                            //console.log("cannot add door: no walls yet?");
                            //binder.graph.remove();
                            //delete binder;
                            bye_binder();
                        }
                    }
                } // END DOOR MODE

                //**************************************************************************
                //**************        MOUSE MOVE:   NODE MODE *****************************************
                //**************************************************************************

                if (mode == 'node_mode') {
                    //console.log("in node_mod. This creates circlebinder as binder if there isn't already a binder");
                    snap = calcul_snap(event, grid_snap);

                    if (typeof(binder) == 'undefined') {
                        if (addNode = floorplanEditor.nearWall(snap, 30)) {
                            var x2 = addNode.wall.end.x;
                            var y2 = addNode.wall.end.y;
                            var x1 = addNode.wall.start.x;
                            var y1 = addNode.wall.start.y;
                            angleWall = qSVG.angle(x1, y1, x2, y2);
                            //console.warn("node_mode: SETTING BINDER AS SVG..");
                            binder = qSVG.create('boxbind', 'path', {
                                id: "extension-floorplanner-circlebinder",
                                d: "M-20,-10 L-13,0 L-20,10 Z M-13,0 L13,0 M13,0 L20,-10 L20,10 Z",
                                stroke: "#5cba79",
                                fill: "#5cba79",
                                "stroke-width": "1.5px"
                            });

                            binder.setAttribute(
                                "transform", "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg + 90) + ",0,0)"
                            );
                            binder.data = addNode;
                            binder.x1 = x1;
                            binder.x2 = x2;
                            binder.y1 = y1;
                            binder.y2 = y2;
                            //console.log("node_mode: see? binder: ", binder);
                        }
                    } else {
                        //console.log("node_mode: a binder already existed: ", binder);
                        //console.log("node_mode: addNode: ", floorplanEditor.nearWall(snap, 30));
                        if (addNode = floorplanEditor.nearWall(snap, 30)) {
                            if (addNode) {
                                var x2 = addNode.wall.end.x;
                                var y2 = addNode.wall.end.y;
                                var x1 = addNode.wall.start.x;
                                var y1 = addNode.wall.start.y;
                                angleWall = qSVG.angle(x1, y1, x2, y2);
                                binder.setAttribute(
                                    "transform", "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg + 90) + ",0,0)"
                                );
                                binder.data = addNode;
                            } else {
                                //console.log("node_mode: removing binder 2");
                                //binder.remove();
                                //delete binder;
                                bye_binder();
                            }
                        } else {
                            //console.log("node_mode: removing binder");
                            //binder.remove();
                            //delete binder;
                            bye_binder();
                        }
                    }
                } // END NODE MODE

                //**********************************  SELECT MODE ***************************************************************
                if (mode == 'select_mode' && drag == 'off') { // FIRST TEST ON SELECT MODE (and drag OFF) to detect MOUSEOVER DOOR
                    //console.log("in select_mode.  drag: ", drag);
                    snap = calcul_snap(event, 'off');
                    //console.log("select mode: snap: ", snap);

                    var objTarget = false;
                    //console.log("select_mode: OBJDATA: ", OBJDATA);
                    //for (var i = OBJDATA.length -1; i >= 0; i--) {
                    for (var i = 0; i < OBJDATA.length; i++) {
                        //console.log(i, ": OBJDATA[i]: ",  OBJDATA[i]);
                        //console.log(i, ": OBJDATA[i].type: ", OBJDATA[i].type);
                        if (typeof OBJDATA[i].type == 'undefined') {
                            console.error("OBJ has undefined type. This should not happen. position: ", i);
                            //console.log("OBJDATA type?", typeof OBJDATA, OBJDATA.constructor);
                            //console.log("OBJDATA.length before slice: ", OBJDATA.length);
                            //OBJDATA.splice(i,1);
                            //OBJDATA.array.splice(index, 1);
                            //console.log("OBJDATA.length after slice: ", OBJDATA.length);
                            //objTarget = false;
                            //bye_binder();
                            continue;
                            return;
                            break;
                        }
                        //console.log("I should not happen after the error");
						if(typeof OBJDATA[i].bbox == 'undefined'){
							console.error("object without bbox: ", OBJDATA[i]);
							continue
						}
                        var objX1 = OBJDATA[i].bbox.left;
                        var objX2 = OBJDATA[i].bbox.right;
                        var objY1 = OBJDATA[i].bbox.top;
                        var objY2 = OBJDATA[i].bbox.bottom;
                        var realBboxCoords = OBJDATA[i].realBbox;
                        //console.log("realBboxCoords: ", realBboxCoords);
                        if (qSVG.rayCasting(snap, realBboxCoords)) {
                            //console.warn("FOUND NEARBY OBJECT: ", OBJDATA[i]);
                            objTarget = OBJDATA[i];
                            //binder = OBJDATA[i];
                            // TODO: why not break here?
                        }
                    }

                    if (objTarget == false) {
                        //console.log("did not find a nearby object");
                        //hideAllSize();
                    }

                    //console.log("select_mode: objTarget:", objTarget);
                    if (typeof(binder) != 'undefined') {
                        //console.log("select_mode: binder:", binder);
                    }


                    if (objTarget !== false) {
                        //console.log("selectMode found a target object: ", objTarget);
                        if (typeof(binder) != 'undefined' && (binder.type == 'segment')) {
                            //console.log("select_mode: removing existing binder of segment type first");
                            //console.log("removing binder that is segment type");
                            binder.graph.remove();
                            //delete binder;
                            bye_binder();
                            cursor('default');
                        }

                        if (objTarget.params.bindBox) { // OBJ -> BOUNDINGBOX TOOL
                            //console.warn("select_mode:  OBJTARGET HAS BINDBOX -> setting binder as obj2D boundingbox");
                            if (typeof(binder) == 'undefined') {
                                //binder = new floorplanEditor.obj2D("free", "boundingBox", "", objTarget.bbox.origin, objTarget.angle, 0, objTarget.size*0.5, "normal", objTarget.thick*0.5, objTarget.realBbox);
                                binder = new floorplanEditor.obj2D("free", "boundingBox", "", objTarget.bbox.origin, objTarget.angle, 0, objTarget.size * 0.3, "normal", objTarget.thick * 0.3, objTarget.realBbox);
                                binder.update();
                                binder.obj = objTarget;
                                binder.type = 'boundingBox';
                                binder.oldX = binder.x;
                                binder.oldY = binder.y;
                                document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
                                if (!objTarget.params.move) cursor('trash'); // LIKE MEASURE ON PLAN
                                if (objTarget.params.move) {
                                    //console.log("this objTarget.params.move is true, setting move cursor");
                                    cursor('move');
                                }
                            }
                        } else { // DOOR, WINDOW, APERTURE.. -- OBJ WITHOUT BINDBOX (params.bindBox = False) -- !!!!
                            //console.log("select_mode: DOOR, WINDOW, APERTURE.. -- NEARBY OBJTARGET, but WITHOUT BINDBOX");
                            //console.log("++objTarget: ", objTarget);

                            if (typeof objTarget.family != 'undefined' && objTarget.family == 'inWall' && typeof(binder) == 'undefined') {
                                //console.log("++binder is undefined. Creating socle");

                                var wallList = floorplanEditor.rayCastingWall(objTarget);
                                if (wallList.length > 1) wallList = wallList[0];
                                inWallRib(wallList);
                                var thickObj = wallList.thick;
                                var sizeObj = objTarget.size;
                                //hideAllSize();
                                binder = new floorplanEditor.obj2D("inWall", "socle", "", objTarget, objTarget.angle, 0, sizeObj, "normal", thickObj);
                                binder.update();

                                binder.oldXY = {
                                    x: objTarget.x,
                                    y: objTarget.y
                                }; // FOR OBJECT MENU
                                document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);


                            } else {

                                if (typeof binder != 'undefined') {
                                    //if (event.target == binder.graph.get(0).firstChild) {
                                    if (typeof binder.graph != 'undefined' && event.target == binder.graph.firstChild) {
                                        cursor('move');
                                        //binder.graph.get(0).firstChild.setAttribute("class", "circle_css_2");

                                        binder.type = "obj";
                                        binder.obj = objTarget;
                                        if (typeof binder.graph != 'undefined') {
                                            if (typeof binder.graph.firstChild != 'undefined') {
                                                //console.log("binder.graph.firstChild: ", binder.graph.firstChild);
                                                if (binder.graph.firstChild != null) {
                                                    binder.graph.firstChild.setAttribute("class", "extension-floorplanner-circle_css_2");
                                                }

                                            } else {
                                                console.error("missing binder.graph.firstChild: ", binder.graph);
                                            }
                                        } else {
                                            console.error("expected a binder.graph");
                                        }

                                    } else {
                                        cursor('default');
                                        //binder.graph.get(0).firstChild.setAttribute("class", "circle_css_1");

                                        binder.type = false;
                                        if (typeof binder.graph != 'undefined') {
                                            if (typeof binder.graph.firstChild != 'undefined') {
                                                //console.log("binder.graph.firstChild: ", binder.graph.firstChild);
                                                if (binder.graph.firstChild != null) {
                                                    binder.graph.firstChild.setAttribute("class", "extension-floorplanner-circle_css_1");
                                                }
                                            } else {
                                                console.error("missing binder.graph.firstChild: ", binder.graph);
                                            }
                                        } else {
                                            console.error("expected a binder.graph");
                                        }

                                    }
                                } else {
                                    console.warn("expected a binder?");
                                }


                                /*
			          var wallList = floorplanEditor.rayCastingWall(objTarget);
			          if (wallList.length > 1) wallList = wallList[0];
			          inWallRib(wallList);
			          var thickObj = wallList.thick;
			          var sizeObj = objTarget.size;

			          binder = new floorplanEditor.obj2D("inWall", "socle", "", objTarget, objTarget.angle, 0, sizeObj, "normal", thickObj);
			                //console.log("select_mode: binder or inWall type: ", binder);
			          binder.update();

			          binder.oldXY = { x: objTarget.x, y: objTarget.y }; // FOR OBJECT MENU
			          document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
			                    */
                            }
                        }
                    } else {
                        //console.log("Did not find an objTarget");
                    }

                    // BIND CIRCLE IF nearNode and GROUP ALL SAME XY SEG POINTS
                    if (wallNode = floorplanEditor.nearWallNode(snap, 20)) {
                        //console.log("POINTER IS NEAR WALL NODE");
                        if (typeof binder != 'undefined') {
                            //console.log("--binder already exists: ", binder);
                        }
                        if (typeof binder == 'undefined' || (typeof binder != 'undefined' && typeof binder.type != 'undefined' && binder.type == 'segment')) {
                            //console.log("replacing binder of type segment with unkillable circlebinder");
                            bye_binder();
                            binder = qSVG.create('boxbind', 'circle', {
                                id: "extension-floorplanner-circlebinder",
                                class: "extension-floorplanner-circle_css_2",
                                cx: wallNode.x,
                                cy: wallNode.y,
                                r: Rcirclebinder
                            });
                            binder.data = wallNode;
                            binder.type = "node";
                            if (document.querySelectorAll('#extension-floorplanner-linebinder').length) document.querySelector('#extension-floorplanner-linebinder').remove();

                        } else {
                            //console.log("...nothing here")
                            // REMAKE CIRCLE_CSS ON BINDER AND TAKE DATA SEG GROUP
                            // if (typeof(binder) != 'undefined') {
                            //     binder.attr({
                            //         class: "circle_css_2"
                            //     });
                            // }
                        }

                        cursor('move');
                    } else if (typeof(binder) != "undefined" && typeof binder.type != "undefined") {
                        //console.log("\n\nchecking binder and objTarget: ", binder, objTarget);
                        if (binder.type == 'node') {
                            //console.log("select_mode: not near wall node, but binder type is node, so calling bye_binder");
                            bye_binder();
                            //binder.remove();
                            //delete binder;
                            hideAllSize();
                            cursor('default');
                            rib();
                        } else if (typeof binder.family != 'undefined' &&
                            binder.family == 'inWall' &&
                            typeof binder.class != 'undefined' &&
                            (binder.class == 'socle' || binder.class == 'doorWindow') &&
                            objTarget !== false &&
                            objTarget.family == 'inWall' &&
                            objTarget.class == 'doorWindow') {

                            //console.warn("spotted the repeating wall box issue");
                            //hideAllSize();
                            //bye_binder();
                            //hideAllSize();



                            //binder = objTarget;
                            //binder.remove();
                            //delete binder;

                            //cursor('default');
                            //rib();

                        } else if (typeof binder.family != 'undefined' &&
                            binder.family == 'inWall' &&
                            typeof binder.class != 'undefined' &&
                            (binder.class == 'socle' || binder.class == 'doorWindow') &&
                            objTarget === false) {

                            //console.warn("binder is inWall, while objTarget is false");
                            bye_binder();
                            hideAllSize();


                        } else {
                            //console.log("mouse move: fell through. binder: ", binder, "\n\n");
                        }


                    } else if (typeof binder != 'undefined') {
                        //console.log("select_mode, but nothing near the mouse pointer? HOWEVER, binder was not undefined: ", binder);

                        //console.log("clearing binder")
                        //if (typeof (binder.graph) != 'undefined') binder.graph.remove();

                        //if (binder.type == 'node') binder.remove();
                        //delete binder;
                        //document.querySelector('#extension-floorplanner-boxbind').replaceChildren(); // experiment

                        //bye_binder();
                        //cursor('default');
                        //rib();

                    }

                    if (typeof binder != "undefined") {
                        //console.log("A binder still exists just before wall checking: ", binder);
                    } else {
                        //console.log("before wall checking binder is gone");
                    }


                    // BIND WALL WITH NEARPOINT function ---> WALL BINDER CREATION
                    if (wallBind = floorplanEditor.rayCastingWalls(snap, WALLS)) {
                        //console.log("wallBinder creation. wallBind: ", wallBind);
                        if (wallBind.length > 1) wallBind = wallBind[wallBind.length - 1];
                        if (wallBind && typeof(binder) == 'undefined') {
                            var objWall = floorplanEditor.objFromWall(wallBind);
                            if (objWall.length > 0) floorplanEditor.inWallRib2(wallBind);
                            binder = {};
                            binder.wall = wallBind;
                            inWallRib(binder.wall);
                            var line = qSVG.create('none', 'line', {
                                x1: binder.wall.start.x,
                                y1: binder.wall.start.y,
                                x2: binder.wall.end.x,
                                y2: binder.wall.end.y,
                                "stroke-width": 5,
                                stroke: "#5cba79"
                            });
                            var ball1 = qSVG.create('none', 'circle', {
                                class: "extension-floorplanner-circle_css",
                                cx: binder.wall.start.x,
                                cy: binder.wall.start.y,
                                r: Rcirclebinder / 1.8
                            });
                            var ball2 = qSVG.create('none', 'circle', {
                                class: "extension-floorplanner-circle_css",
                                cx: binder.wall.end.x,
                                cy: binder.wall.end.y,
                                r: Rcirclebinder / 1.8
                            });
                            binder.graph = qSVG.create('none', 'g');
                            binder.graph.append(line);
                            binder.graph.append(ball1);
                            binder.graph.append(ball2);
                            document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
                            binder.type = "segment";
                            cursor('pointer');
                        }
                    } else {
                        //console.log("doing nearWall");
                        if (wallBind = floorplanEditor.nearWall(snap, 6)) {
                            //console.log("got wallbind after doing nearwall: ", wallBind);
                            if (wallBind && typeof(binder) == 'undefined') {
                                //console.log("got wallbind after doing nearwall, but binder was undefined. Creating an SVG of a line between two balls.");
                                wallBind = wallBind.wall;
                                var objWall = floorplanEditor.objFromWall(wallBind);
                                if (objWall.length > 0) floorplanEditor.inWallRib2(wallBind);
                                binder = {};
                                binder.wall = wallBind;
                                inWallRib(binder.wall);
                                var line = qSVG.create('none', 'line', {
                                    x1: binder.wall.start.x,
                                    y1: binder.wall.start.y,
                                    x2: binder.wall.end.x,
                                    y2: binder.wall.end.y,
                                    "stroke-width": 5,
                                    stroke: "#5cba79"
                                });
                                var ball1 = qSVG.create('none', 'circle', {
                                    class: "extension-floorplanner-circle_css",
                                    cx: binder.wall.start.x,
                                    cy: binder.wall.start.y,
                                    r: Rcirclebinder / 1.8
                                });
                                var ball2 = qSVG.create('none', 'circle', {
                                    class: "extension-floorplanner-circle_css",
                                    cx: binder.wall.end.x,
                                    cy: binder.wall.end.y,
                                    r: Rcirclebinder / 1.8
                                });
                                binder.graph = qSVG.create('none', 'g');
                                binder.graph.append(line);
                                binder.graph.append(ball1);
                                binder.graph.append(ball2);
                                document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
                                binder.type = "segment";
                                cursor('pointer');
                            }
                        } else {
                            //console.log("not near a wall");
                            if (typeof(binder) != "undefined") {
                                //console.log("I'd like to delete this binder: ", binder);
                                if (typeof(binder) != "undefined" && typeof binder.type != 'undefined' && binder.type == 'segment') {
                                    //console.log("not near a wall, and binder was of type segment, so removing that old wall indicator.");
                                    //binder.graph.remove();
                                    //delete binder;
                                    bye_binder();
                                    hideAllSize();
                                    cursor('default');
                                    rib();
                                } else if (objTarget == false) {
                                    if (typeof binder.obj != 'undefined') {
                                        bye_binder();
                                        hideAllSize();
                                        cursor('default');
                                        rib();
                                    } else if (isNaN(binder.height)) {
                                        bye_binder();
                                        hideAllSize();
                                        cursor('default');
                                        rib();
                                    }
                                } else {
                                    if (typeof binder.obj != 'undefined') {
                                        if (objTarget == binder.obj) {
                                            //console.log("GOOD, the binder is the currently nearest object.");
                                        } else {
                                            bye_binder();
                                            hideAllSize();
                                            cursor('default');
                                            rib();
                                        }
                                    } else if (isNaN(binder.height)) {
                                        console.error("binder.height was NaN");
                                        bye_binder();
                                        hideAllSize();
                                        cursor('default');
                                        rib();
                                    }



                                }
                                //console.log("but should check if it's actually nearby.  objTarget: ", objTarget);
                                /*
			                    if(typeof binder.obj != 'undefined'){
			                        bye_binder();
			              hideAllSize();
			              cursor('default');
			              rib();
			                    }
			                    */

                            }

                            /*
			                else if (typeof (binder) != "undefined"){
			                    bye_binder();
			          hideAllSize();
			          cursor('default');
			          rib();
			                }
			                */
                        }
                    }
                } // END mode == 'select_mode' && drag == 'off'

                // ------------------------------  LINE MODE ------------------------------------------------------

                if ((mode == 'line_mode' || mode == 'partition_mode') && action == 0) {
                    snap = calcul_snap(event, 'off');
                    cursor('grab');
                    pox = snap.x;
                    poy = snap.y;
                    if (helpConstruc = intersection(snap, 25)) {
                        if (helpConstruc.distance < 10) {
                            pox = helpConstruc.x;
                            poy = helpConstruc.y;
                            cursor('grab');
                        } else {
                            cursor('crosshair');
                        }
                    }
                    if (wallNode = floorplanEditor.nearWallNode(snap, 20)) {
                        pox = wallNode.x;
                        poy = wallNode.y;
                        cursor('grab');
                        if (typeof(binder) == 'undefined') {
                            binder = qSVG.create('boxbind', 'circle', {
                                id: "extension-floorplanner-circlebinder",
                                class: "extension-floorplanner-circle_css_2",
                                cx: wallNode.x,
                                cy: wallNode.y,
                                r: Rcirclebinder / 1.5
                            });
                        }
                        intersectionOff();
                    } else {
                        if (!helpConstruc) cursor('crosshair');
                        if (typeof(binder) != "undefined") {
                            if (binder.graph) binder.graph.remove();
                            else bye_binder(); //binder.remove();
                            //delete binder;
                        }
                    }
                }

                // ******************************************************************************************************
                // ************************** ACTION = 1   LINE MODE => WALL CREATE                 *********************
                // ******************************************************************************************************

                if (action == 1 && (mode == 'line_mode' || mode == 'partition_mode')) {
                    snap = calcul_snap(event, grid_snap);
                    x = snap.x;
                    y = snap.y;
                    let starter = minMoveGrid(snap);

                    if (!document.querySelectorAll('#extension-floorplanner-line_construc').length) {
                        if (wallNode = floorplanEditor.nearWallNode(snap, 20)) {
                            pox = wallNode.x;
                            poy = wallNode.y;

                            wallStartConstruc = false;
                            if (wallNode.bestWall == WALLS.length - 1) {
                                cursor('validation');
                            } else {
                                cursor('grab');
                            }
                        } else {
                            cursor('crosshair');
                        }
                    }


                    if (starter > grid) {
                        if (!document.querySelectorAll('#extension-floorplanner-line_construc').length) {
                            var ws = 20;
                            if (mode == 'partition_mode') ws = 10;
                            lineconstruc = qSVG.create("boxbind", "line", {
                                id: "extension-floorplanner-line_construc",
                                x1: pox,
                                y1: poy,
                                x2: x,
                                y2: y,
                                "stroke-width": ws,
                                "stroke-linecap": "butt",
                                "stroke-opacity": 0.7,
                                stroke: "#9fb2e2"
                            });

                            let svgadd = qSVG.create("boxbind", "line", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
                                id: "extension-floorplanner-linetemp",
                                x1: pox,
                                y1: poy,
                                x2: x,
                                y2: y,
                                "stroke": "transparent",
                                "stroke-width": 0.5,
                                "stroke-opacity": "0.9"
                            });
                        } else { // THE LINES AND BINDER ARE CREATED

                            // TODO: this check shouldn't exist.. maybe?
                            if (document.querySelector('#extension-floorplanner-linetemp')) {
                                document.querySelector('#extension-floorplanner-linetemp').setAttribute('x2', x);
                                document.querySelector('#extension-floorplanner-linetemp').setAttribute('y2', y);
                            }


                            if (helpConstrucEnd = intersection(snap, 10)) {
                                x = helpConstrucEnd.x;
                                y = helpConstrucEnd.y;
                            }
                            if (wallEndConstruc = floorplanEditor.nearWall(snap, 12)) { // TO SNAP SEGMENT TO FINALIZE X2Y2
                                x = wallEndConstruc.x;
                                y = wallEndConstruc.y;
                                cursor('grab');
                            } else {
                                cursor('crosshair');
                            }

                            // nearNode helped to attach the end of the construc line
                            if (wallNode = floorplanEditor.nearWallNode(snap, 20)) {
                                if (typeof(binder) == 'undefined') {
                                    binder = qSVG.create('boxbind', 'circle', {
                                        id: "extension-floorplanner-circlebinder",
                                        class: "extension-floorplanner-circle_css_2",
                                        cx: wallNode.x,
                                        cy: wallNode.y,
                                        r: Rcirclebinder / 1.5
                                    });
                                }

                                const testje = document.querySelectorAll('#extension-floorplanner-line_construc');
                                if (testje.length > 1) {
                                    console.error("yikes, there are multiple linecontructs with the same ID");
                                }

                                document.querySelector('#extension-floorplanner-line_construc').setAttribute('x2', wallNode.x);
                                document.querySelector('#extension-floorplanner-line_construc').setAttribute('y2', wallNode.y);

                                x = wallNode.x;
                                y = wallNode.y;
                                wallEndConstruc = true;
                                intersectionOff();
                                if (wallNode.bestWall == WALLS.length - 1 && document.getElementById("extension-floorplanner-multi").checked) {
                                    cursor('validation');
                                } else {
                                    cursor('grab');
                                }
                            } else {
                                if (typeof(binder) != "undefined") {
                                    //binder.remove();
                                    //delete binder;
                                    bye_binder();
                                }
                                if (wallEndConstruc === false) cursor('crosshair');
                            }
                            // LINETEMP AND LITLLE SNAPPING FOR HELP TO CONSTRUC ANGLE 0 90 45 *****************************************
                            var fltt = qSVG.angle(pox, poy, x, y);
                            var flt = Math.abs(fltt.deg);
                            var coeff = fltt.deg / flt; // -45 -> -1     45 -> 1
                            var phi = poy - (coeff * pox);
                            var Xdiag = (y - phi) / coeff;
                            if (typeof(binder) == 'undefined') {
                                // HELP FOR H LINE
                                var found = false;
                                if (flt < 15 && Math.abs(poy - y) < 25) {
                                    y = poy;
                                    found = true;
                                } // HELP FOR V LINE
                                if (flt > 75 && Math.abs(pox - x) < 25) {
                                    x = pox;
                                    found = true;
                                } // HELP FOR DIAG LINE
                                if (flt < 55 && flt > 35 && Math.abs(Xdiag - x) < 20) {
                                    x = Xdiag;
                                    found = true;
                                }
                                if (found) document.querySelector('#extension-floorplanner-line_construc').setAttribute("stroke-opacity", 1);
                                else document.querySelector('#extension-floorplanner-line_construc').setAttribute("stroke-opacity", 0.7);
                            }
                            if (document.querySelector('#extension-floorplanner-line_construc')) {
                                document.querySelector('#extension-floorplanner-line_construc').setAttribute("x2", x);
                                document.querySelector('#extension-floorplanner-line_construc').setAttribute("y2", y);
                            }


                            // SHOW WALL SIZE -------------------------------------------------------------------------
                            var startText = qSVG.middle(pox, poy, x, y);
                            var angleText = qSVG.angle(pox, poy, x, y);
                            var valueText = ((qSVG.measure({
                                x: pox,
                                y: poy
                            }, {
                                x: x,
                                y: y
                            })) / 60).toFixed(2);
                            if (typeof(lengthTemp) == 'undefined') {
                                lengthTemp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                lengthTemp.setAttributeNS(null, 'x', startText.x);
                                lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
                                lengthTemp.setAttributeNS(null, 'text-anchor', 'middle');
                                lengthTemp.setAttributeNS(null, 'stroke', 'none');
                                lengthTemp.setAttributeNS(null, 'stroke-width', '0.6px');
                                lengthTemp.setAttributeNS(null, 'fill', '#777777');
                                lengthTemp.textContent = valueText + 'm';
                                document.querySelector('#extension-floorplanner-boxbind').append(lengthTemp);
                            }
                            if (typeof(lengthTemp) != 'undefined' && valueText > 0.1) {
                                lengthTemp.setAttributeNS(null, 'x', startText.x);
                                lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
                                lengthTemp.setAttribute("transform", "rotate(" + angleText.deg + " " + startText.x + "," + startText.y + ")");
                                lengthTemp.textContent = valueText + ' m';
                            }
                            if (typeof(lengthTemp) != 'undefined' && valueText < 0.1) {
                                lengthTemp.textContent = "";
                            }
                        }
                    }
                } // END LINE MODE DETECT && ACTION = 1

                //ONMOVE
                // **************************************************************************************************
                //        ____ ___ _   _ ____  _____ ____
                //        | __ )_ _| \ | |  _ \| ____|  _ \
                //        |  _ \| ||  \| | | | |  _| | |_) |
                //        | |_) | || |\  | |_| | |___|  _ <
                //        |____/___|_| \_|____/|_____|_| \_\
                //
                // **************************************************************************************************

                if (mode == 'bind_mode') {
                    //console.log("in bind_mode. binder: ", binder);
                    //console.log("--binder.type: ", binder.type);
                    snap = calcul_snap(event, grid_snap);
                    //console.log("snap: ", snap);

                    if (binder.type == 'node') {
                        //console.log("binder type is node");
                        var coords = snap;
                        var magnetic = false;
                        for (var k in wallListRun) {
                            if (isObjectsEquals(wallListRun[k].end, binder.data)) {
                                if (Math.abs(wallListRun[k].start.x - snap.x) < 20) {
                                    coords.x = wallListRun[k].start.x;
                                    magnetic = "H";
                                }
                                if (Math.abs(wallListRun[k].start.y - snap.y) < 20) {
                                    coords.y = wallListRun[k].start.y;
                                    magnetic = "V";
                                }
                            }
                            if (isObjectsEquals(wallListRun[k].start, binder.data)) {
                                if (Math.abs(wallListRun[k].end.x - snap.x) < 20) {
                                    coords.x = wallListRun[k].end.x;
                                    magnetic = "H";
                                }
                                if (Math.abs(wallListRun[k].end.y - snap.y) < 20) {
                                    coords.y = wallListRun[k].end.y;
                                    magnetic = "V";
                                }
                            }
                        }

                        //console.log("near wall? ", floorplanEditor.nearWallNode(snap, 15, wallListRun));
                        if (nodeMove = floorplanEditor.nearWallNode(snap, 15, wallListRun)) { // sic: single =
                            coords.x = nodeMove.x;
                            coords.y = nodeMove.y;

                            //console.log("WRONG BINDER?! ", binder);

                            if (document.querySelector('#extension-floorplanner-circlebinder')) {
                                //console.log("circlebinder el existed: ", document.querySelector('#extension-floorplanner-circlebinder'));
                                document.querySelector('#extension-floorplanner-circlebinder').setAttribute("class", "extension-floorplanner-circleGum");
                                document.querySelector('#extension-floorplanner-circlebinder').setAttribute("cx", coords.x);
                                document.querySelector('#extension-floorplanner-circlebinder').setAttribute("cy", coords.y);
                            } else {
                                //console.log("circlebinder el did not exist");
                                /*
			                    bye_binder();
			            binder = qSVG.create('boxbind', 'circle', {
			              id: "extension-floorplanner-circlebinder",
			              class: "extension-floorplanner-circleGum",
			              cx: coords.x,
			              cy: coords.y,
			              r: Rcirclebinder
			            });
			            //binder.data = wallNode;
			            //binder.type = "node";
			                    */
                            }

                            cursor('grab');
                        } else {
                            //console.log("RIGHT BINDER?!", binder);
                            if (magnetic != false) {
                                if (magnetic == "H") snap.x = coords.x;
                                else snap.y = coords.y;
                            }
                            if (helpConstruc = intersection(snap, 10, wallListRun)) {
                                coords.x = helpConstruc.x;
                                coords.y = helpConstruc.y;
                                snap.x = helpConstruc.x;
                                snap.y = helpConstruc.y;
                                if (magnetic != false) {
                                    if (magnetic == "H") snap.x = coords.x;
                                    else snap.y = coords.y;
                                }
                                cursor('grab');
                            } else {
                                cursor('move');
                            }
                            binder.remove()
                            //bye_binder();
                            //document.querySelector('#extension-floorplanner-circlebinder').attr({"class": "circle_css", cx: coords.x, cy: coords.y});
                        }
                        for (var k in wallListRun) {
                            if (isObjectsEquals(wallListRun[k].start, binder.data)) {
                                wallListRun[k].start.x = coords.x;
                                wallListRun[k].start.y = coords.y;
                            }
                            if (isObjectsEquals(wallListRun[k].end, binder.data)) {
                                wallListRun[k].end.x = coords.x;
                                wallListRun[k].end.y = coords.y;
                            }
                        }
                        binder.data = coords;
                        floorplanEditor.wallsComputing(WALLS, false); // UPDATE FALSE

                        for (var k in wallListObj) {
                            var wall = wallListObj[k].wall;
                            var objTarget = wallListObj[k].obj;
                            var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                            var limits = limitObj(wall.equations.base, 2 * wallListObj[k].distance, wallListObj[k].from); // COORDS OBJ AFTER ROTATION
                            var indexLimits = 0;
                            if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) indexLimits = 1;
                            // NEW COORDS OBJDATA[obj]
                            objTarget.x = limits[indexLimits].x;
                            objTarget.y = limits[indexLimits].y;
                            objTarget.angle = angleWall;
                            if (objTarget.angleSign == 1) objTarget.angle = angleWall + 180;

                            var limitBtwn = limitObj(wall.equations.base, objTarget.size, objTarget); // OBJ SIZE OK BTWN xy1/xy2

                            if (qSVG.btwn(limitBtwn[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limitBtwn[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[1].y, wall.start.y, wall.end.y)) {
                                objTarget.limit = limitBtwn;
                                objTarget.update();
                            } else {
                                objTarget.graph.remove();
                                //delete objTarget;
                                OBJDATA.splice(wall.indexObj, 1);
                                wallListObj.splice(k, 1);
                            }
                        }
                        // for (k in toClean)
                        document.querySelector('#extension-floorplanner-boxRoom').replaceChildren();
                        document.querySelector('#extension-floorplanner-boxSurface').replaceChildren();
                        Rooms = qSVG.polygonize(WALLS);
                        floorplanEditor.roomMaker(Rooms);
                    }

                    // WALL MOVING ----BINDER TYPE SEGMENT-------- FUNCTION FOR H,V and Calculate Vectorial Translation

                    if (binder.type == 'segment' && action == 1) {
                        rib();

                        if (equation2.A == 'v') {
                            equation2.B = snap.x;
                        } else if (equation2.A == 'h') {
                            equation2.B = snap.y;
                        } else {
                            equation2.B = snap.y - (snap.x * equation2.A);
                        }

                        var intersection1 = qSVG.intersectionOfEquations(equation1, equation2, "obj");
                        var intersection2 = qSVG.intersectionOfEquations(equation2, equation3, "obj");
                        var intersection3 = qSVG.intersectionOfEquations(equation1, equation3, "obj");

                        if (binder.wall.parent != null) {
                            if (isObjectsEquals(binder.wall.parent.end, binder.wall.start)) binder.wall.parent.end = intersection1;
                            else if (isObjectsEquals(binder.wall.parent.start, binder.wall.start)) binder.wall.parent.start = intersection1;
                            else binder.wall.parent.end = intersection1;
                        }

                        if (binder.wall.child != null) {
                            if (isObjectsEquals(binder.wall.child.start, binder.wall.end)) binder.wall.child.start = intersection2;
                            else if (isObjectsEquals(binder.wall.child.end, binder.wall.end)) binder.wall.child.end = intersection2;
                            else binder.wall.child.start = intersection2;
                        }

                        binder.wall.start = intersection1;
                        binder.wall.end = intersection2;
                        binder.graph.remove()
                        // binder.graph[0].children[0].setAttribute("x1",intersection1.x);
                        // binder.graph[0].children[0].setAttribute("x2",intersection2.x);
                        // binder.graph[0].children[0].setAttribute("y1",intersection1.y);
                        // binder.graph[0].children[0].setAttribute("y2",intersection2.y);
                        // binder.graph[0].children[1].setAttribute("cx",intersection1.x);
                        // binder.graph[0].children[1].setAttribute("cy",intersection1.y);
                        // binder.graph[0].children[2].setAttribute("cx",intersection2.x);
                        // binder.graph[0].children[2].setAttribute("cy",intersection2.y);

                        // THE EQ FOLLOWED BY eq (PARENT EQ1 --- CHILD EQ3)
                        if (equation1.follow != undefined) {
                            if (!qSVG.rayCasting(intersection1, equation1.backUp.coords)) { // IF OUT OF WALL FOLLOWED
                                var distanceFromStart = qSVG.gap(equation1.backUp.start, intersection1);
                                var distanceFromEnd = qSVG.gap(equation1.backUp.end, intersection1);
                                if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
                                    equation1.follow.end = intersection1;
                                } else {
                                    equation1.follow.start = intersection1;
                                }
                            } else {
                                equation1.follow.end = equation1.backUp.end;
                                equation1.follow.start = equation1.backUp.start;
                            }
                        }
                        if (equation3.follow != undefined) {
                            if (!qSVG.rayCasting(intersection2, equation3.backUp.coords)) { // IF OUT OF WALL FOLLOWED
                                var distanceFromStart = qSVG.gap(equation3.backUp.start, intersection2);
                                var distanceFromEnd = qSVG.gap(equation3.backUp.end, intersection2);
                                if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
                                    equation3.follow.end = intersection2;
                                } else {
                                    equation3.follow.start = intersection2;
                                }
                            } else {
                                equation3.follow.end = equation3.backUp.end;
                                equation3.follow.start = equation3.backUp.start;
                            }
                        }

                        // EQ FOLLOWERS WALL MOVING
                        for (var i = 0; i < equationFollowers.length; i++) {
                            var intersectionFollowers = qSVG.intersectionOfEquations(equationFollowers[i].eq, equation2, "obj");
                            if (qSVG.btwn(intersectionFollowers.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(intersectionFollowers.y, binder.wall.start.y, binder.wall.end.y, 'round')) {
                                var size = qSVG.measure(equationFollowers[i].wall.start, equationFollowers[i].wall.end);
                                if (equationFollowers[i].type == "start") {
                                    equationFollowers[i].wall.start = intersectionFollowers;
                                    if (size < 5) {
                                        if (equationFollowers[i].wall.child == null) {
                                            WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                                            equationFollowers.splice(i, 1);
                                        }
                                    }
                                }
                                if (equationFollowers[i].type == "end") {
                                    equationFollowers[i].wall.end = intersectionFollowers;
                                    if (size < 5) {
                                        if (equationFollowers[i].wall.parent == null) {
                                            WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                                            equationFollowers.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                        // WALL COMPUTING, BLOCK FAMILY OF BINDERWALL IF NULL (START OR END) !!!!!
                        floorplanEditor.wallsComputing(WALLS, "move");
                        Rooms = qSVG.polygonize(WALLS);

                        // OBJDATA(s) FOLLOW 90° EDGE SELECTED
                        for (var rp = 0; rp < equationsObj.length; rp++) {
                            var objTarget = equationsObj[rp].obj;
                            var intersectionObj = qSVG.intersectionOfEquations(equationsObj[rp].eq, equation2);
                            // NEW COORDS OBJDATA[o]
                            objTarget.x = intersectionObj[0];
                            objTarget.y = intersectionObj[1];
                            var limits = limitObj(equation2, objTarget.size, objTarget);
                            if (qSVG.btwn(limits[0].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[0].y, binder.wall.start.y, binder.wall.end.y) && qSVG.btwn(limits[1].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[1].y, binder.wall.start.y, binder.wall.end.y)) {
                                objTarget.limit = limits;
                                objTarget.update();
                            }
                        }
                        // DELETING ALL OBJECT "INWALL" OVERSIZED INTO ITS EDGE (EDGE BY EDGE CONTROL)
                        for (var k in WALLS) {
                            var objWall = floorplanEditor.objFromWall(WALLS[k]); // LIST OBJ ON EDGE
                            for (var ob in objWall) {
                                var objTarget = objWall[ob];
                                var eq = floorplanEditor.createEquationFromWall(WALLS[k]);
                                var limits = limitObj(eq, objTarget.size, objTarget);
                                if (!qSVG.btwn(limits[0].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[0].y, WALLS[k].start.y, WALLS[k].end.y) || !qSVG.btwn(limits[1].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[1].y, WALLS[k].start.y, WALLS[k].end.y)) {
                                    objTarget.graph.remove();
                                    //delete objTarget;
                                    var indexObj = OBJDATA.indexOf(objTarget);
                                    OBJDATA.splice(indexObj, 1);
                                }
                            }
                        }

                        equationsObj = []; // REINIT eqObj -> MAYBE ONE OR PLUS OF OBJDATA REMOVED !!!!
                        var objWall = floorplanEditor.objFromWall(binder.wall); // LIST OBJ ON EDGE
                        for (var ob = 0; ob < objWall.length; ob++) {
                            var objTarget = objWall[ob];
                            equationsObj.push({
                                obj: objTarget,
                                wall: binder.wall,
                                eq: qSVG.perpendicularEquation(equation2, objTarget.x, objTarget.y)
                            });
                        }

                        document.querySelector('#extension-floorplanner-boxRoom').replaceChildren();
                        document.querySelector('#extension-floorplanner-boxSurface').replaceChildren();
                        floorplanEditor.roomMaker(Rooms);
                        document.querySelector('#extension-floorplanner-lin').style.cursor = 'pointer';
                    }

                    // **********************************************************************
                    // ----------------------  BOUNDING BOX ------------------------------
                    // **********************************************************************
                    // binder.obj.params.move ---> FOR MEASURE DONT MOVE
                    if (binder.type == 'boundingBox' && action == 1 && binder.obj.params.move) {


                        if (typeof binder.obj != 'undefined' && typeof binder.obj.graph != 'undefined') {
                            if (OBJDATA.indexOf(binder.obj) != -1 && OBJDATA.indexOf(binder.obj) != OBJDATA.length - 1) {
                                //console.log("attempting to move object to end of OBJDATA array");
                                //console.log("objTarget.graph: ", binder.obj.graph);
                                //console.log("objTarget.graph.parentElement: ", binder.obj.graph.parentElement);

                                binder.obj.graph.parentElement.appendChild(binder.obj.graph);
                                // removeChild(objTarget.graph)
                                //parent.removeChild(tooltip);

                                //let spliced_object = OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
                                OBJDATA.push(OBJDATA.splice(OBJDATA.indexOf(binder.obj), 1)[0]);
                                //console.log("moved object to end of OBJDATA array. length halfway: ", OBJDATA.length);
                                //console.log("spliced object: ", typeof spliced_object, spliced_object, JSON.stringify(spliced_object));
                                //OBJDATA.push(spliced_object);
                                //console.log("moving object to end of OBJDATA array. length at the end: ", OBJDATA.length);
                                //console.log("spliced OBJDATA: ", OBJDATA, JSON.stringify(OBJDATA));
                            } else {
                                //console.log("object was already at the end of the OBJDATA array, no need to shift it");
                            }

                            binder.obj.graph.style.filter = 'drop-shadow(0px 0px 5px rgb(0 0 0 / 0.4))';
                            /*
                            let paths = binder.obj.graph.querySelectorAll('path');
                            //console.log("paths: ", paths);
                            if(paths.length){
                                //paths[0].setAttribute('filter','url(#filter1)');
                            }

                            for(var p=0; p<paths.length; ++p) {
                                //console.log("paths[p]: ", paths[p]);
                                paths[p].setAttribute('filter','url(#shadow3)');
                              //paths[p].setAttribute('filter','url(#dropshadow)');
                            }
                            */


                        }




                        binder.x = snap.x;
                        binder.y = snap.y;
                        binder.obj.x = snap.x;
                        binder.obj.y = snap.y;
                        binder.obj.update();
                        binder.update();
                    }

                    // **********************************************************************
                    // OBJ MOVING
                    // **********************************************************************
                    if (binder.type == 'obj' && action == 1) {
                        if (wallSelect = floorplanEditor.nearWall(snap)) {
                            if (wallSelect.wall.type != 'separate') {
                                inWallRib(wallSelect.wall);

                                var objTarget = binder.obj;
                                var wall = wallSelect.wall;
                                var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                                var v1 = qSVG.vectorXY({
                                    x: wall.start.x,
                                    y: wall.start.y
                                }, {
                                    x: wall.end.x,
                                    y: wall.end.y
                                });
                                var v2 = qSVG.vectorXY({
                                    x: wall.end.x,
                                    y: wall.end.y
                                }, snap);
                                var newAngle = qSVG.vectorDeter(v1, v2);
                                binder.angleSign = 0;
                                objTarget.angleSign = 0;
                                if (Math.sign(newAngle) == 1) {
                                    angleWall += 180;
                                    binder.angleSign = 1;
                                    objTarget.angleSign = 1;
                                }
                                var limits = limitObj(wall.equations.base, binder.size, wallSelect);
                                if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                                    binder.x = wallSelect.x;
                                    binder.y = wallSelect.y;
                                    binder.angle = angleWall;
                                    binder.thick = wall.thick;
                                    objTarget.x = wallSelect.x;
                                    objTarget.y = wallSelect.y;
                                    objTarget.angle = angleWall;
                                    objTarget.thick = wall.thick;
                                    objTarget.limit = limits;
                                    binder.update();
                                    objTarget.update();
                                }

                                if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
                                    if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
                                        binder.x = limits[0].x;
                                        binder.y = limits[0].y;
                                        objTarget.x = limits[0].x;
                                        objTarget.y = limits[0].y;
                                        objTarget.limit = limits;
                                    }
                                    if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                                        binder.x = limits[1].x;
                                        binder.y = limits[1].y;
                                        objTarget.x = limits[1].x;
                                        objTarget.y = limits[1].y;
                                        objTarget.limit = limits;
                                    }
                                    binder.angle = angleWall;
                                    binder.thick = wall.thick;
                                    objTarget.angle = angleWall;
                                    objTarget.thick = wall.thick;
                                    binder.update();
                                    objTarget.update();
                                }
                            }
                        }
                    } // END OBJ MOVE
                    if (binder.type != 'obj' && binder.type != 'segment') rib();
                }
                // ENDBIND ACTION MOVE **************************************************************************

                // ---DRAG VIEWBOX PANNING -------------------------------------------------------

                if (mode == 'select_mode' && drag == 'on') {
                    snap = calcul_snap(event, grid_snap);
                    document.querySelector('#extension-floorplanner-lin').style.cursor = 'move';
                    let distX = (snap.xMouse - pox) * factor;
                    let distY = (snap.yMouse - poy) * factor;
                    // pox = event.pageX;
                    // poy = event.pageY;
                    zoom_maker('zoomdrag', distX, distY);
                }
            }


            // END MOUSEMOVE


















            // *****************************************************************************************************
            // *****************************************************************************************************
            // *****************************************************************************************************
            // ******************************        MOUSE DOWN            *****************************************
            // *****************************************************************************************************
            // *****************************************************************************************************
            // *****************************************************************************************************

            function _MOUSEDOWN(event) {
                //console.warn("MOUSEDOWN");

                if (currently_editing_an_object || currently_cloning_an_object) {
                    //console.log("mousedown:  currently_editing_an_object, currently_cloning_an_object, binder: ", currently_editing_an_object, currently_cloning_an_object, binder);
                    currently_editing_an_object = false;
                    currently_cloning_an_object = false;
                    fonc_button('select_mode');
                    box_info_el.innerHTML = ''; // Selection mode
                    document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'none';
                    panel_el.style.display = 'block';
                    //if(typeof binder != 'undefined' && typeof binder.graph != 'undefined') binder.graph.remove(); // superfluous..
                    //bye_binder();
                }



                document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'none';
                event.preventDefault();
                hide_submenus();
                // *******************************************************************
                // **************************   DISTANCE MODE   **********************
                // *******************************************************************
                if (mode == 'distance_mode') {
                    if (action == 0) {
                        action = 1;
                        snap = calcul_snap(event, grid_snap);
                        pox = snap.x;
                        poy = snap.y;

                        //document.querySelector('#extension-floorplanner-boxMeasure').replaceChildren();
                    }
                }

                // *******************************************************************
                // *************************   LINE/WALL MODE   **********************
                // *******************************************************************
                if (mode == 'line_mode' || mode == 'partition_mode') {

                    /*
                    if(document.querySelector('#extension-floorplanner-room_mode.extension-floorplanner-btn-success') != null
                        || document.querySelector('#extension-floorplanner-line_mode.extension-floorplanner-btn-success') != null
                        || document.querySelector('#extension-floorplanner-partition_mode.extension-floorplanner-btn-success') != null
                    ){
                        root_el.classList.add('extension-floorplanner-do-not-pulsate');
                    }
                    */
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                    if (action == 0) {

                        snap = calcul_snap(event, grid_snap);
                        pox = snap.x;
                        poy = snap.y;
                        if (wallStartConstruc = floorplanEditor.nearWall(snap, 12)) { // TO SNAP SEGMENT TO FINALIZE X2Y2
                            pox = wallStartConstruc.x;
                            poy = wallStartConstruc.y;
                        }
                    } else {
                        // FINALIZE LINE_++
                        construc = 1;
                    }
                    action = 1;
                }
                if (mode == 'edit_door_mode') { // ACTION 1 ACTIVATE EDITION OF THE DOOR
                    action = 1;
                    document.querySelector('#extension-floorplanner-lin').style.cursor = 'pointer';
                }

                // *******************************************************************
                // **********************   SELECT MODE + BIND   *********************
                // *******************************************************************
                if (mode == 'select_mode') {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');

                    if (typeof(binder) != 'undefined') {

                        if (typeof binder.obj != 'undefined') {
                            //console.log("MOUSEDOWN: OK, binder is defined and has type: ", binder, binder.type);
                        } else {
                            //console.log("MOUSEDOWN: binder is defined but has no type: ", binder);
                        }
                    } else {
                        //console.error("MOUSEDOWN: binder is undefined");
                    }
                    // the binder.type check shouldn't be here...
                    if (typeof(binder) != 'undefined' && typeof(binder.type) != 'undefined' && (binder.type == 'segment' || binder.type == 'node' || binder.type == 'obj' || binder.type == 'boundingBox')) {
                        mode = 'bind_mode';
                        //console.log("mouse down -> select_mode switching to bind_mode.");


                        if (binder.type == 'obj') {
                            action = 1;
                        }

                        if (binder.type == 'boundingBox') {
                            action = 1;
                        }

                        // INIT FOR HELP BINDER NODE MOVING H V (MOUSE DOWN)
                        if (binder.type == 'node') {
                            document.querySelector('#extension-floorplanner-boxScale').style.display = 'none'
                            var node = binder.data;
                            pox = node.x;
                            poy = node.y;
                            var nodeControl = {
                                x: pox,
                                y: poy
                            };

                            // DETERMINATE DISTANCE OF OPPOSED NODE ON EDGE(s) PARENT(s) OF THIS NODE !!!! NODE 1 -- NODE 2 SYSTE% :-(
                            wallListObj = []; // SUPER VAR -- WARNING
                            var objWall;
                            wallListRun = [];
                            for (var ee = WALLS.length - 1; ee > -1; ee--) { // SEARCH MOST YOUNG WALL COORDS IN NODE BINDER
                                if (isObjectsEquals(WALLS[ee].start, nodeControl) || isObjectsEquals(WALLS[ee].end, nodeControl)) {
                                    wallListRun.push(WALLS[ee]);
                                    break;
                                }
                            }
                            //console.log("wallListRun: ", wallListRun);
                            if (wallListRun.length) {
                                if (wallListRun[0].child != null) {
                                    if (isObjectsEquals(wallListRun[0].child.start, nodeControl) || isObjectsEquals(wallListRun[0].child.end, nodeControl)) wallListRun.push(wallListRun[0].child);
                                }
                                if (wallListRun[0].parent != null) {
                                    if (isObjectsEquals(wallListRun[0].parent.start, nodeControl) || isObjectsEquals(wallListRun[0].parent.end, nodeControl)) wallListRun.push(wallListRun[0].parent);
                                }
                            }


                            for (var k in wallListRun) {
                                if (isObjectsEquals(wallListRun[k].start, nodeControl) || isObjectsEquals(wallListRun[k].end, nodeControl)) {
                                    var nodeTarget = wallListRun[k].start;
                                    if (isObjectsEquals(wallListRun[k].start, nodeControl)) {
                                        nodeTarget = wallListRun[k].end;
                                    }
                                    objWall = floorplanEditor.objFromWall(wallListRun[k]); // LIST OBJ ON EDGE -- NOT INDEX !!!
                                    wall = wallListRun[k];
                                    for (var ob = 0; ob < objWall.length; ob++) {
                                        var objTarget = objWall[ob];
                                        var distance = qSVG.measure(objTarget, nodeTarget);
                                        wallListObj.push({
                                            wall: wall,
                                            from: nodeTarget,
                                            distance: distance,
                                            obj: objTarget,
                                            indexObj: ob
                                        });
                                    }
                                }
                            }
                            magnetic = 0;
                            action = 1;
                        }

                        if (binder.type == 'segment') {

                            document.querySelector('#extension-floorplanner-boxScale').style.display = 'none'
                            var wall = binder.wall;
                            binder.before = binder.wall.start;
                            equation2 = floorplanEditor.createEquationFromWall(wall);
                            if (wall.parent != null) {
                                equation1 = floorplanEditor.createEquationFromWall(wall.parent);
                                var angle12 = qSVG.angleBetweenEquations(equation1.A, equation2.A);
                                if (angle12 < 20 || angle12 > 160) {
                                    var found = true;
                                    for (var k in WALLS) {
                                        if (qSVG.rayCasting(wall.start, WALLS[k].coords) && !isObjectsEquals(WALLS[k], wall.parent) && !isObjectsEquals(WALLS[k], wall)) {
                                            if (wall.parent.parent != null && isObjectsEquals(wall, wall.parent.parent)) wall.parent.parent = null;
                                            if (wall.parent.child != null && isObjectsEquals(wall, wall.parent.child)) wall.parent.child = null;
                                            wall.parent = null;
                                            found = false;
                                            break;
                                        }
                                    }
                                    if (found) {
                                        var newWall;
                                        if (isObjectsEquals(wall.parent.end, wall.start, "1")) {
                                            newWall = new floorplanEditor.wall(wall.parent.end, wall.start, "normal", wall.thick);
                                            WALLS.push(newWall);
                                            newWall.parent = wall.parent;
                                            newWall.child = wall;
                                            wall.parent.child = newWall;
                                            wall.parent = newWall;
                                            equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
                                        } else if (isObjectsEquals(wall.parent.start, wall.start, "2")) {
                                            newWall = new floorplanEditor.wall(wall.parent.start, wall.start, "normal", wall.thick);
                                            WALLS.push(newWall);
                                            newWall.parent = wall.parent;
                                            newWall.child = wall;
                                            wall.parent.parent = newWall;
                                            wall.parent = newWall;
                                            equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
                                        }
                                        // CREATE NEW WALL
                                    }
                                }
                            }
                            if (wall.parent == null) {
                                var foundEq = false;
                                for (var k in WALLS) {
                                    if (qSVG.rayCasting(wall.start, WALLS[k].coords) && !isObjectsEquals(WALLS[k].coords, wall.coords)) {
                                        var angleFollow = qSVG.angleBetweenEquations(WALLS[k].equations.base.A, equation2.A);
                                        if (angleFollow < 20 || angleFollow > 160) break;
                                        equation1 = floorplanEditor.createEquationFromWall(WALLS[k]);
                                        equation1.follow = WALLS[k];
                                        equation1.backUp = {
                                            coords: WALLS[k].coords,
                                            start: WALLS[k].start,
                                            end: WALLS[k].end,
                                            child: WALLS[k].child,
                                            parent: WALLS[k].parent
                                        };
                                        foundEq = true;
                                        break;
                                    }
                                }
                                if (!foundEq) equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
                            }

                            if (wall.child != null) {
                                equation3 = floorplanEditor.createEquationFromWall(wall.child);
                                var angle23 = qSVG.angleBetweenEquations(equation3.A, equation2.A);
                                if (angle23 < 20 || angle23 > 160) {
                                    var found = true;
                                    for (var k in WALLS) {
                                        if (qSVG.rayCasting(wall.end, WALLS[k].coords) && !isObjectsEquals(WALLS[k], wall.child) && !isObjectsEquals(WALLS[k], wall)) {
                                            if (wall.child.parent != null && isObjectsEquals(wall, wall.child.parent)) wall.child.parent = null;
                                            if (wall.child.child != null && isObjectsEquals(wall, wall.child.child)) wall.child.child = null;
                                            wall.child = null;
                                            found = false;
                                            break;
                                        }
                                    }
                                    if (found) {
                                        if (isObjectsEquals(wall.child.start, wall.end)) {
                                            var newWall = new floorplanEditor.wall(wall.end, wall.child.start, "new", wall.thick);
                                            WALLS.push(newWall);
                                            newWall.parent = wall;
                                            newWall.child = wall.child;
                                            wall.child.parent = newWall;
                                            wall.child = newWall;
                                            equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
                                        } else if (isObjectsEquals(wall.child.end, wall.end)) {
                                            var newWall = new floorplanEditor.wall(wall.end, wall.child.end, "normal", wall.thick);
                                            WALLS.push(newWall);
                                            newWall.parent = wall;
                                            newWall.child = wall.child;
                                            wall.child.child = newWall;
                                            wall.child = newWall;
                                            equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
                                        }
                                        // CREATE NEW WALL
                                    }
                                }
                            }
                            if (wall.child == null) {
                                var foundEq = false;
                                for (var k in WALLS) {
                                    if (qSVG.rayCasting(wall.end, WALLS[k].coords) && !isObjectsEquals(WALLS[k].coords, wall.coords, "4")) {
                                        var angleFollow = qSVG.angleBetweenEquations(WALLS[k].equations.base.A, equation2.A);
                                        if (angleFollow < 20 || angleFollow > 160) break;
                                        equation3 = floorplanEditor.createEquationFromWall(WALLS[k]);
                                        equation3.follow = WALLS[k];
                                        equation3.backUp = {
                                            coords: WALLS[k].coords,
                                            start: WALLS[k].start,
                                            end: WALLS[k].end,
                                            child: WALLS[k].child,
                                            parent: WALLS[k].parent
                                        };
                                        foundEq = true;
                                        break;
                                    }
                                }
                                if (!foundEq) equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
                            }

                            equationFollowers = [];
                            for (var k in WALLS) {
                                if (WALLS[k].child == null && qSVG.rayCasting(WALLS[k].end, wall.coords) && !isObjectsEquals(wall, WALLS[k])) {
                                    equationFollowers.push({
                                        wall: WALLS[k],
                                        eq: floorplanEditor.createEquationFromWall(WALLS[k]),
                                        type: "end"
                                    });
                                }
                                if (WALLS[k].parent == null && qSVG.rayCasting(WALLS[k].start, wall.coords) && !isObjectsEquals(wall, WALLS[k])) {
                                    equationFollowers.push({
                                        wall: WALLS[k],
                                        eq: floorplanEditor.createEquationFromWall(WALLS[k]),
                                        type: "start"
                                    });
                                }
                            }

                            equationsObj = [];
                            var objWall = floorplanEditor.objFromWall(wall); // LIST OBJ ON EDGE
                            for (var ob = 0; ob < objWall.length; ob++) {
                                var objTarget = objWall[ob];
                                equationsObj.push({
                                    obj: objTarget,
                                    wall: wall,
                                    eq: qSVG.perpendicularEquation(equation2, objTarget.x, objTarget.y)
                                });
                            }
                            action = 1;
                        }
                    } else {
                        //console.log("mousedown: assuming this is a start of a drag because binder did not exist or had no type");
                        action = 0;
                        //console.warn("DRAG ON");
                        drag = 'on';
                        snap = calcul_snap(event, grid_snap);
                        pox = snap.xMouse;
                        poy = snap.yMouse;
                        document.getElementById('extension-floorplanner-tool-root').classList.add("extension-floorplanner-do-not-pulsate");


                    }
                }
            }

            //******************************************************************************************************
            //*******************  *****  ******        ************************************************************
            //*******************  *****  ******  ****  ************************************************************
            //*******************  *****  ******  ****  ************************************************************
            //*******************  *****  ******        ************************************************************
            //*******************         ******  ******************************************************************
            //**********************************  ******************************************************************

            function _MOUSEUP(event) {
                //console.warn("MOUSEUP");
                if (showRib) document.querySelector('#extension-floorplanner-boxScale').style.display = 'block';
                if (drag == 'on') {
                    //console.log("MOUSEUP: END OF A DRAG");
                }

                if (typeof binder != 'undefined' && typeof binder.type != 'undefined' && typeof binder.obj != 'undefined' && typeof binder.obj.graph != 'undefined') {
                    binder.obj.graph.style.filter = 'none';
                }

                if (document.querySelector('#extension-floorplanner-room_mode.extension-floorplanner-btn-success') == null &&
                    document.querySelector('#extension-floorplanner-line_mode.extension-floorplanner-btn-success') == null &&
                    document.querySelector('#extension-floorplanner-partition_mode.extension-floorplanner-btn-success') == null &&
                    document.querySelector('#extension-floorplanner-distance_mode.extension-floorplanner-btn-success') == null

                ) {
                    //console.log("Allowing pulsate");
                    root_el.classList.remove('extension-floorplanner-do-not-pulsate');
                }



                drag = 'off';
                cursor('default');

                /*
				if (document.body.classList.contains('developer')) {
                    document.getElementById('extension-floorplanner-title').innerText = mode;
                }
				*/

                if (mode == 'select_mode') {
                    if (typeof(binder) != 'undefined') {
                        //console.log("mouseup, and binder still existed, which is not supposed to happen. calling byebinder");
                        //binder.remove();
                        //delete binder;
                        bye_binder();
                        //hideAllSize();
                        floorplanSave();
                    }
                }

                //**************************************************************************
                //********************   TEXTE   MODE **************************************
                //**************************************************************************
                if (mode == 'text_mode') {
                    if (action == 0) {
                        action = 1;
                        text_modal_el.style.display = 'block';
                        mode == 'edit_text_mode';
                    }
                }

                //**************************************************************************
                //**************        OBJECT   MODE **************************************
                //**************************************************************************
                if (mode == 'object_mode') {
                    //console.log("mouse_up: in object_mode. this fixates a binder as an object in OBJDATA.  binder:", binder);
                    if (typeof binder.graph != 'undefined' && typeof binder.type != 'undefined') {

                        if (binder.type != 'boundingBox') {
                            //console.warn("adding boundingbox to OBJDATA: ", binder);
                            //OBJDATA.push(binder);
                        } else {
                            //console.error("almost added boundingbox to OBJDATA.  binder: ", binder);
                        }
                        if (typeof binder.class != 'undefined' && binder.class == 'measure') {
                            //console.log("not saving measurement");
                        } else {
                            OBJDATA.push(binder);
                        }
                        //console.log("object_mode: ", binder, binder.family, binder.class, binder.type);
                    } else {
                        console.error("attempted to save an svg element to object list! ", binder);
                    }

                    //console.log("OBJDATA is now: ", OBJDATA);
                    //console.log("object_mode: OBJDATA[OBJDATA.length - 1].class: ", OBJDATA[OBJDATA.length - 1].class);
                    if (typeof binder.graph != 'undefined') binder.graph.remove();
                    var targetBox = 'boxcarpentry';
                    if (OBJDATA[OBJDATA.length - 1].class == 'text') targetBox = 'boxText';
                    else if (OBJDATA[OBJDATA.length - 1].class == 'energy') targetBox = 'boxEnergy';
                    else if (OBJDATA[OBJDATA.length - 1].class == 'furniture') targetBox = 'boxFurniture';
                    else if (OBJDATA[OBJDATA.length - 1].class == 'measure') targetBox = 'boxMeasure';
                    document.querySelector('g#extension-floorplanner-' + targetBox).append(OBJDATA[OBJDATA.length - 1].graph);
                    //delete binder;
                    bye_binder();
                    box_info_el.innerHTML = ''; // Object added
                    fonc_button('select_mode');
                    floorplanSave();
                }

                // *******************************************************************
                // **************************   UP: DISTANCE MODE   ******************
                // *******************************************************************
                if (mode == 'distance_mode') {

                    if (action == 1) {
                        action = 0;
                        // MODIFY BBOX FOR BINDER ZONE (TXT)
                        var bbox = labelMeasure.getBoundingClientRect();
                        bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
                        bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
                        //console.log("distance_mode: bbox x&y: ", bbox.x, bbox.y);


                        bbox.origin = {
                            x: bbox.x + (bbox.width / 2),
                            y: bbox.y + (bbox.height / 2)
                        };
                        //console.log("distance_mode: bbox: ", bbox);
                        binder.bbox = bbox;
                        binder.realBbox = [{
                            x: binder.bbox.x,
                            y: binder.bbox.y
                        }, {
                            x: binder.bbox.x + binder.bbox.width,
                            y: binder.bbox.y
                        }, {
                            x: binder.bbox.x + binder.bbox.width,
                            y: binder.bbox.y + binder.bbox.height
                        }, {
                            x: binder.bbox.x,
                            y: binder.bbox.y + binder.bbox.height
                        }];
                        //console.log("distance_mode: new size&thick from: binder.bbox.width,binder.bbox.height: ", binder.bbox.width, binder.bbox.height);
                        //console.log("binder.realBbox: ", binder.realBbox);

                        binder.size = binder.bbox.width;
                        binder.thick = binder.bbox.height;
                        binder.graph.append(labelMeasure);

                        //OBJDATA.push(binder);
                        //console.log("distance_mode: typeof binder.graph: ", typeof binder.graph, binder.graph, binder.graph.outerHTML);

                        if (typeof binder.graph != 'undefined') {
                            //console.error("distance_mode: APPENDING TO BOXMEASURE, IN THEORY");

                            let path_copy = binder.graph.cloneNode(true);
                            //console.log("path_copy: ", path_copy);
                            let newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");

                            let measure_d = binder.graph.getAttribute("d");
                            //console.log("measure_d: ", measure_d);
                            let path_html = binder.graph.outerHTML;
                            //console.log("path_html: ", path_html);
                            document.querySelector('g#extension-floorplanner-boxMeasure').append(path_copy);
                            //let binder_clone = binder.cloneNode(true);
                            //document.querySelector('g#extension-floorplanner-boxMeasure').append(binder_clone.graph);

                            //document.querySelector('g#extension-floorplanner-boxMeasure').append(OBJDATA[OBJDATA.length - 1].graph);
                            //document.querySelector('g#extension-floorplanner-boxMeasure').append(OBJDATA[OBJDATA.length - 1].graph);
                            //document.querySelector('g#extension-floorplanner-boxMeasure').append(binder.graph.outerHTML);



                            binder.graph.remove();
                            //OBJDATA.push(binder);
                        } else {
                            console.error("distance_mode: no binder.graph.  binder: ", binder);
                        }

                        try {
                            //delete labelMeasure;
                        } catch (e) {
                            console.error("distance_mode: could not delete labelMeasure: ", e);
                        }

                        bye_binder();


                        try {
                            cross.remove();
                            //delete cross;
                            //delete labelMeasure;
                        } catch (e) {
                            console.error("distance_mode: could not delete cross: ", e);
                        }

                        box_info_el.innerHTML = 'Measurement added';
                        fonc_button('select_mode');
                        floorplanSave();
                    }
                }

                // *******************************************************************
                // **************************   ROOM MODE   **************************
                // *******************************************************************

                if (mode == 'room_mode') {

                    if (typeof(binder) == "undefined") {
                        return false;
                    }

                    var area = binder.area / 3600;
                    binder.setAttribute('fill', 'none');
                    binder.setAttribute('stroke', '#ddf00a');
                    binder.setAttribute('stroke-width', 7);
                    document.querySelector('.extension-floorplanner-size').innerHTML = area.toFixed(2) + " m²";
                    document.querySelector('#extension-floorplanner-roomIndex').value = binder.id;
                    if (typeof ROOM[binder.id] != 'undefined' && typeof ROOM[binder.id].surface != 'undefined' && ROOM[binder.id].surface != '') document.querySelector('#extension-floorplanner-roomSurface').value = ROOM[binder.id].surface;
                    else document.querySelector('#extension-floorplanner-roomSurface').value = '';
                    document.querySelector('#extension-floorplanner-seeArea').checked = ROOM[binder.id].showSurface;
                    document.querySelector('#extension-floorplanner-roomBackground').value = ROOM[binder.id].color;
                    var roomName = ROOM[binder.id].name;
                    document.querySelector('#extension-floorplanner-roomLabel').value = roomName;
                    if (ROOM[binder.id].name != '') {
                        document.querySelector('#extension-floorplanner-roomName').innerHTML = roomName + ' <span class="extension-floorplanner-caret"></span>';
                    } else {
                        document.querySelector('#extension-floorplanner-roomName').innerHTML = 'None <span class="extension-floorplanner-caret"></span>';
                    }

                    var actionToDo = ROOM[binder.id].action;
                    document.querySelector('#extension-floorplanner-' + actionToDo + 'Action').checked = true;
                    panel_el.style.display = 'none';
                    document.querySelector('#extension-floorplanner-roomTools').style.display = 'block';
                    document.querySelector('#extension-floorplanner-lin').style.cursor = 'default';
                    box_info_el.innerHTML = 'Select a room';

                    mode = 'edit_room_mode';
                    floorplanSave();
                }

                // *******************************************************************
                // **************************   NODE MODE   **************************
                // *******************************************************************

                if (mode == 'node_mode') {
                    if (typeof(binder) != 'undefined') { // ALSO ON MOUSEUP WITH HAVE CIRCLEBINDER ON ADDPOINT
                        var newWall = new floorplanEditor.wall({
                            x: binder.data.x,
                            y: binder.data.y
                        }, binder.data.wall.end, "normal", binder.data.wall.thick);
                        WALLS.push(newWall);
                        binder.data.wall.end = {
                            x: binder.data.x,
                            y: binder.data.y
                        };
                        //binder.remove();
                        //delete binder;
                        bye_binder();
                        floorplanEditor.architect(WALLS);
                        floorplanSave();
                    }
                    fonc_button('select_mode');
                }

                // *******************************************************************  ***** ****      *******  ******  ******  *****
                // **************************   UP: OBJ MODE   ***************************  *   * *******     *****  ******  ******   **
                // *******************************************************************  ***** ****       ******  ******  ******  ***

                if (mode == 'door_mode') {
                    if (typeof(binder) == "undefined") {
                        box_info_el.innerHTML = 'Draw a wall first';
                        fonc_button('select_mode');
                        return false;
                    }
                    OBJDATA.push(binder);
                    if (typeof binder.graph != 'undefined') binder.graph.remove();
                    document.querySelector('#extension-floorplanner-boxcarpentry').append(OBJDATA[OBJDATA.length - 1].graph);
                    //delete binder;
                    bye_binder();
                    box_info_el.innerHTML = 'Element added';
                    fonc_button('select_mode');
                    floorplanSave();
                }

                // *******************************************************************
                // ********************   UP: LINE MODE MOUSE UP   ***********************
                // *******************************************************************

                if (mode == 'line_mode' || mode == 'partition_mode') {
                    // This shouldn't be here.. of maybe it should.
                    if (document.querySelector('#extension-floorplanner-linetemp')) {
                        document.querySelector('#extension-floorplanner-linetemp').remove(); // DEL LINE HELP CONSTRUC 0 45 90
                    }
                    if (document.querySelector('#extension-floorplanner-room_mode.extension-floorplanner-btn-success') != null ||
                        document.querySelector('#extension-floorplanner-line_mode.extension-floorplanner-btn-success') != null ||
                        document.querySelector('#extension-floorplanner-partition_mode.extension-floorplanner-btn-success') != null ||
                        document.querySelector('#extension-floorplanner-distance_mode.extension-floorplanner-btn-success') != null
                    ) {
                        //console.log("forbidding pulsate because of wall/line mode");
                        root_el.classList.add('extension-floorplanner-do-not-pulsate');
                    }


                    intersectionOff();
					
					
					
                    var sizeWall = qSVG.measure({
                        x: x,
                        y: y
                    }, {
                        x: pox,
                        y: poy
                    });
                    sizeWall = sizeWall / meter;
                    if (document.querySelectorAll('#extension-floorplanner-line_construc').length && sizeWall > 0.3) {
                        var sizeWall = wallSize;
                        if (mode == 'partition_mode') sizeWall = partitionSize;
                        var wall = new floorplanEditor.wall({
                            x: pox,
                            y: poy
                        }, {
                            x: x,
                            y: y
                        }, "normal", sizeWall);
                        WALLS.push(wall);
                        floorplanEditor.architect(WALLS);

                        if (document.getElementById("extension-floorplanner-multi").checked && !wallEndConstruc) {
                            cursor('validation');
                            action = 1;
                        } else action = 0;
                        box_info_el.innerHTML = 'Wall added <span style=\'font-size:0.6em\'> ' + (qSVG.measure({
                            x: pox,
                            y: poy
                        }, {
                            x: x,
                            y: y
                        }) / 60).toFixed(2) + ' m</span>';
                        document.querySelector('#extension-floorplanner-line_construc').remove(); // DEL LINE CONSTRUC HELP TO VIEW NEW SEG PATH
                        lengthTemp.remove();
                        //delete lengthTemp;
                        construc = 0;
                        if (wallEndConstruc) action = 0;
                        //delete wallEndConstruc;
                        pox = x;
                        poy = y;
                        floorplanSave();
                    } else {
                        action = 0;
                        construc = 0;
                        box_info_el.innerHTML = ''; // Select mode
                        fonc_button('select_mode');
                        if (typeof(binder) != 'undefined') {
                            //binder.remove();
                            //delete binder;
                            bye_binder();
                        }
                        snap = calcul_snap(event, grid_snap);
                        pox = snap.x;
                        poy = snap.y;
                    }
                }
                // **************************** END LINE MODE MOUSE UP **************************

                //**************************************************************************************
                //**********************      BIND MODE MOUSE UP    ************************************
                //**************************************************************************************

                if (mode == 'bind_mode') {
                    //console.log("mouseup: in bind_mode");
                    action = 0;
                    construc = 0; // CONSTRUC 0 TO FREE BINDER GROUP NODE WALL MOVING
                    if (typeof(binder) != 'undefined') {
                        //console.log("mouseup: binder exists, switching from bind_mode to select mode");
                        fonc_button('select_mode');
                        if (typeof binder != 'undefined' && typeof binder.type == 'undefined') {
                            console.error("mouseup: binder.type was undefined, which is unexpected");
                        }
                         // END BINDER NODE

                        if (binder.type == 'segment') {

                            var found = false;
                            if (binder.wall.start == binder.before) {
                                found = true;
                            }

                            if (found) {
                                panel_el.style.display = 'none'
                                var objWall = floorplanEditor.objFromWall(wallBind);
                                box_info_el.innerHTML = 'Modify a wall'; // <br/><span style="font-size:0.7em;color:#de9b43">This wall can\'t become a separation (it contains doors or windows)</span>
                                if (objWall.length > 0){
                                	//document.querySelector('#extension-floorplanner-separate').style.display = 'none';
                                } 
                                else if (binder.wall.type == 'separate') {
                                    //document.querySelector('#extension-floorplanner-separate').style.display = 'none';
                                    document.querySelector('#extension-floorplanner-rangeThick').style.display = 'none';
                                    //document.querySelector('#extension-floorplanner-recombine').style.display = 'block';
                                    //document.querySelector('#extension-floorplanner-cutWall').style.display = 'none';
                                    document.getElementById('extension-floorplanner-titleWallTools').textContent = "Modify the separation";
                                } else {
                                    //document.querySelector('#extension-floorplanner-cutWall').style.display = 'block';
                                    //document.querySelector('#extension-floorplanner-separate').style.display = 'block';
                                    document.querySelector('#extension-floorplanner-rangeThick').style.display = 'block';
                                    //document.querySelector('#extension-floorplanner-recombine').style.display = 'none';
                                    document.getElementById('extension-floorplanner-titleWallTools').textContent = "Modify the wall";
                                    box_info_el.innerHTML = 'Modify the wall';
                                }
                                document.querySelector('#extension-floorplanner-wallTools').style.display = 'block'
                                document.getElementById('extension-floorplanner-wallWidth').setAttribute('min', 1);
                                document.getElementById('extension-floorplanner-wallWidth').setAttribute('max', 50);
                                document.getElementById('extension-floorplanner-wallWidthScale').textContent = "1-50";
                                document.getElementById("extension-floorplanner-wallWidth").value = binder.wall.thick;
                                document.getElementById("extension-floorplanner-wallWidthVal").textContent = binder.wall.thick;
                                mode = 'edit_wall_mode';
                            }
                            //delete equation1;
                            //delete equation2;
                            //delete equation3;
                            //delete intersectionFollowers;
                        }

                        if (binder.type == 'obj') {

                            var moveObj = Math.abs(binder.oldXY.x - binder.x) + Math.abs(binder.oldXY.y - binder.y);
                            if (moveObj < 1) {
                                //console.log("setting edit_door_mode");
                                panel_el.style.display = 'none';
                                document.querySelector('#extension-floorplanner-objTools').style.display = 'block';
                                document.querySelector('#extension-floorplanner-lin').style.cursor = 'default';
                                box_info_el.innerHTML = 'Configure the door/window';
                                //console.log('obj ??', obj);
                                document.getElementById('extension-floorplanner-doorWindowWidth').setAttribute('min', binder.obj.params.resizeLimit.width.min);
                                document.getElementById('extension-floorplanner-doorWindowWidth').setAttribute('max', binder.obj.params.resizeLimit.width.max);
                                //document.getElementById('extension-floorplanner-doorWindowWidthScale').textContent = binder.obj.params.resizeLimit.width.min + "-" + binder.obj.params.resizeLimit.width.max;
                                document.getElementById('extension-floorplanner-doorWindowWidthScale-min').textContent = binder.obj.params.resizeLimit.width.min;
                                document.getElementById('extension-floorplanner-doorWindowWidthScale-max').textContent = binder.obj.params.resizeLimit.width.max;

                                document.getElementById("extension-floorplanner-doorWindowWidth").value = binder.obj.size;
                                document.getElementById("extension-floorplanner-doorWindowWidthVal").textContent = binder.obj.size;
                                mode = 'edit_door_mode';
                            } else {
                                //console.log("modify door failure because object has moved: ", moveObj);
                                mode = "select_mode";
                                action = 0;
                                if (typeof binder.graph != 'undefined') binder.graph.remove();
                                //delete binder;
                                bye_binder();
                            }
                        }

                        if (typeof(binder) != 'undefined' && binder.type == 'boundingBox') {
                            var moveObj = Math.abs(binder.oldX - binder.x) + Math.abs(binder.oldY - binder.y);
                            objTarget = binder.obj;
                            if (!objTarget.params.move) {
                                // TO REMOVE MEASURE ON PLAN
                                objTarget.graph.remove();
                                OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
                                box_info_el.innerHTML = 'Measurement deleted';
                            }
                            //console.log("prior OBJDATA: ", OBJDATA);
                            //console.log("moving object to end of OBJDATA array. length before: ", OBJDATA.length);
                            // Move selected item to the end of the array, to ensure it's draw on top.
                            //objTarget.graph.remove();
                            /*
                            if(OBJDATA.indexOf(objTarget) != OBJDATA.length - 1){
                                //console.log("attempting to move object to end of OBJDATA array");
                                //console.log("objTarget.graph: ", objTarget.graph);
                                //console.log("objTarget.graph.parentElement: ", objTarget.graph.parentElement);

                                objTarget.graph.parentElement.appendChild(objTarget.graph);
                                // removeChild(objTarget.graph)
                                //parent.removeChild(tooltip);

                                //let spliced_object = OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
                                OBJDATA.push(OBJDATA.splice(OBJDATA.indexOf(objTarget),1)[0]);
                                //console.log("moved object to end of OBJDATA array. length halfway: ", OBJDATA.length);
                                //console.log("spliced object: ", typeof spliced_object, spliced_object, JSON.stringify(spliced_object));
                                //OBJDATA.push(spliced_object);
                                //console.log("moving object to end of OBJDATA array. length at the end: ", OBJDATA.length);
                                //console.log("spliced OBJDATA: ", OBJDATA, JSON.stringify(OBJDATA));
                            }
                            else{
                                //console.log("object was already at the end of the OBJDATA array, no need to shift it");
                            }
                            */


                            if (moveObj < 1 && objTarget.params.move) {
                                if (!objTarget.params.resize) document.querySelector('#extension-floorplanner-objBoundingBoxScale').style.display = 'none';
                                else document.querySelector('#extension-floorplanner-objBoundingBoxScale').style.display = 'block';
                                if (!objTarget.params.rotate) document.querySelector('#extension-floorplanner-objBoundingBoxRotation').style.display = 'none';
                                else document.querySelector('#extension-floorplanner-objBoundingBoxRotation').style.display = 'block';
                                panel_el.style.display = 'none'
                                //console.log(objTarget.params.resizeLimit.width.min)
                                setTimeout(() => {
                                    currently_editing_an_object = true;
                                }, 100)

                                document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'block'
                                document.querySelector('#extension-floorplanner-lin').style.cursor = 'default';
                                box_info_el.innerHTML = 'Modify the object';
                                //console.log(objTarget)
                                if (objTarget.params.resizeLimit) {
                                    //console.log("object has resize limit: ", objTarget.params.resizeLimit);

                                    document.getElementById('extension-floorplanner-bboxWidth').setAttribute('min', objTarget.params.resizeLimit.width.min);
                                    document.getElementById('extension-floorplanner-bboxWidth').setAttribute('max', objTarget.params.resizeLimit.width.max);
                                    //document.getElementById('extension-floorplanner-bboxWidthScale').textContent = objTarget.params.resizeLimit.width.min + "-" + objTarget.params.resizeLimit.height.max;
                                    document.getElementById('extension-floorplanner-bboxWidthScale-min').textContent = objTarget.params.resizeLimit.width.min;
                                    document.getElementById('extension-floorplanner-bboxWidthScale-max').textContent = objTarget.params.resizeLimit.width.max;
                                    document.getElementById('extension-floorplanner-bboxHeight').setAttribute('min', objTarget.params.resizeLimit.height.min);
                                    document.getElementById('extension-floorplanner-bboxHeight').setAttribute('max', objTarget.params.resizeLimit.height.max);
                                    //document.getElementById('extension-floorplanner-bboxHeightScale').textContent = objTarget.params.resizeLimit.height.min + "-" + objTarget.params.resizeLimit.height.max;
                                    document.getElementById('extension-floorplanner-bboxHeightScale-min').textContent = objTarget.params.resizeLimit.height.min;
                                    document.getElementById('extension-floorplanner-bboxHeightScale-max').textContent = objTarget.params.resizeLimit.height.max;
                                }

                                document.querySelector('#extension-floorplanner-stepsCounter').style.display = 'none';
                                if (objTarget.class == 'stair') {
                                    document.getElementById("extension-floorplanner-bboxStepsVal").textContent = objTarget.value;
                                    document.querySelector('#extension-floorplanner-stepsCounter').style.display = 'block';
                                }
                                document.getElementById("extension-floorplanner-bboxWidth").value = objTarget.width * 100;
                                document.getElementById("extension-floorplanner-bboxWidthVal").textContent = objTarget.width * 100;
                                document.getElementById("extension-floorplanner-bboxHeight").value = objTarget.height * 100;
                                document.getElementById("extension-floorplanner-bboxHeightVal").textContent = objTarget.height * 100;
                                document.getElementById("extension-floorplanner-bboxRotation").value = objTarget.angle;
                                document.getElementById("extension-floorplanner-bboxRotationVal").textContent = objTarget.angle;
                                mode = 'edit_boundingBox_mode';
                            } else {
                                mode = "select_mode";
                                action = 0;
                                if (typeof binder.graph != 'undefined') binder.graph.remove();
                                //delete binder;
                                bye_binder();
                            }
                        }

                        if (mode == 'bind_mode') {
                            //binder.remove();
                            //delete binder;
                            bye_binder();
                        }
                    } // END BIND IS DEFINED
                    floorplanSave();
                } // END BIND MODE

                if (mode != 'edit_room_mode') {
                    floorplanEditor.showScaleBox();
                    rib();
                }
            }
































            //
            //   FUNC
            //







            //console.error("in func.js. ratio_viewbox: ", ratio_viewbox);

            // **************************************************************************
            // *****************   LOAD / SAVE LOCALSTORAGE      ************************
            // **************************************************************************

            function initHistory(boot = false) {
                //console.log("in initHistory. boot,current_filename: ", boot, current_filename);

                //clear_floorplan();

                if (boot) {

                    let new_floorplan_name = document.getElementById('extension-floorplanner-modal-new-floorplan-name-input').value;
					document.getElementById('extension-floorplanner-modal-new-floorplan-name-input').value = '';
                    if (new_floorplan_name != '') {
                        clear_floorplan(true,true);
                        current_filename = new_floorplan_name;
                        localStorage.setItem('extension-floorplanner-current-filename', JSON.stringify(new_floorplan_name));
                        document.getElementById('extension-floorplanner-newFileModal').style.display = 'none';

                    } else if (boot !== "recovery") {
                        alert("Please provide a valid floorplan name");
                        return
                    }


                }

                HISTORY.index = 0;

                if (!boot && localStorage.getItem('extension-floorplanner-history')) localStorage.removeItem('extension-floorplanner-history');

                if (localStorage.getItem('extension-floorplanner-history') && boot === "recovery") {
                    try {
                        //console.log("initHistory attempting recovery");
                        let historyTemp = JSON.parse(localStorage.getItem('extension-floorplanner-history'));
                        floorplanLoad(historyTemp.length - 1, "boot");
                        floorplanSave("boot");
                    } catch (e) {
                        console.error("could not parse history from localStorage: ", e);
                        localStorage.removeItem('extension-floorplanner-history');
                        clear_floorplan(true);
                    }
                }

                if (boot === "newSquare") {
                    if (localStorage.getItem('extension-floorplanner-history')) localStorage.removeItem('extension-floorplanner-history');
                    HISTORY.push({
                        "objData": [],
                        "wallData": [{
                            "thick": 20,
                            "start": {
                                "x": 540,
                                "y": 194
                            },
                            "end": {
                                "x": 540,
                                "y": 734
                            },
                            "type": "normal",
                            "parent": 3,
                            "child": 1,
                            "angle": 1.5707963267948966,
                            "equations": {
                                "up": {
                                    "A": "v",
                                    "B": 550
                                },
                                "down": {
                                    "A": "v",
                                    "B": 530
                                },
                                "base": {
                                    "A": "v",
                                    "B": 540
                                }
                            },
                            "coords": [{
                                "x": 550,
                                "y": 204
                            }, {
                                "x": 530,
                                "y": 184
                            }, {
                                "x": 530,
                                "y": 744
                            }, {
                                "x": 550,
                                "y": 724
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 540,
                                "y": 734
                            },
                            "end": {
                                "x": 1080,
                                "y": 734
                            },
                            "type": "normal",
                            "parent": 0,
                            "child": 2,
                            "angle": 0,
                            "equations": {
                                "up": {
                                    "A": "h",
                                    "B": 724
                                },
                                "down": {
                                    "A": "h",
                                    "B": 744
                                },
                                "base": {
                                    "A": "h",
                                    "B": 734
                                }
                            },
                            "coords": [{
                                "x": 550,
                                "y": 724
                            }, {
                                "x": 530,
                                "y": 744
                            }, {
                                "x": 1090,
                                "y": 744
                            }, {
                                "x": 1070,
                                "y": 724
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1080,
                                "y": 734
                            },
                            "end": {
                                "x": 1080,
                                "y": 194
                            },
                            "type": "normal",
                            "parent": 1,
                            "child": 3,
                            "angle": -1.5707963267948966,
                            "equations": {
                                "up": {
                                    "A": "v",
                                    "B": 1070
                                },
                                "down": {
                                    "A": "v",
                                    "B": 1090
                                },
                                "base": {
                                    "A": "v",
                                    "B": 1080
                                }
                            },
                            "coords": [{
                                "x": 1070,
                                "y": 724
                            }, {
                                "x": 1090,
                                "y": 744
                            }, {
                                "x": 1090,
                                "y": 184
                            }, {
                                "x": 1070,
                                "y": 204
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1080,
                                "y": 194
                            },
                            "end": {
                                "x": 540,
                                "y": 194
                            },
                            "type": "normal",
                            "parent": 2,
                            "child": 0,
                            "angle": 3.141592653589793,
                            "equations": {
                                "up": {
                                    "A": "h",
                                    "B": 204
                                },
                                "down": {
                                    "A": "h",
                                    "B": 184
                                },
                                "base": {
                                    "A": "h",
                                    "B": 194
                                }
                            },
                            "coords": [{
                                "x": 1070,
                                "y": 204
                            }, {
                                "x": 1090,
                                "y": 184
                            }, {
                                "x": 530,
                                "y": 184
                            }, {
                                "x": 550,
                                "y": 204
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }],
                        "roomData": [{
                            "coords": [{
                                "x": 540,
                                "y": 734
                            }, {
                                "x": 1080,
                                "y": 734
                            }, {
                                "x": 1080,
                                "y": 194
                            }, {
                                "x": 540,
                                "y": 194
                            }, {
                                "x": 540,
                                "y": 734
                            }],
                            "coordsOutside": [{
                                "x": 1090,
                                "y": 744
                            }, {
                                "x": 1090,
                                "y": 184
                            }, {
                                "x": 530,
                                "y": 184
                            }, {
                                "x": 530,
                                "y": 744
                            }, {
                                "x": 1090,
                                "y": 744
                            }],
                            "coordsInside": [{
                                "x": 1070,
                                "y": 724
                            }, {
                                "x": 1070,
                                "y": 204
                            }, {
                                "x": 550,
                                "y": 204
                            }, {
                                "x": 550,
                                "y": 724
                            }, {
                                "x": 1070,
                                "y": 724
                            }],
                            "inside": [],
                            "way": ["0", "2", "3", "1", "0"],
                            "area": 270400,
                            "surface": "",
                            "name": "",
                            "color": "gradientWhite",
                            "showSurface": true,
                            "action": "add"
                        }]
                    });
                    HISTORY[0] = JSON.stringify(HISTORY[0]);
                    localStorage.setItem('extension-floorplanner-history', JSON.stringify(HISTORY));
                    floorplanLoad(0);
                    floorplanSave();
                    save_to_floorplans();
                } else if (boot === "newL") {
                    if (localStorage.getItem('extension-floorplanner-history')) localStorage.removeItem('extension-floorplanner-history');
                    HISTORY.push({
                        "objData": [],
                        "wallData": [{
                            "thick": 20,
                            "start": {
                                "x": 447,
                                "y": 458
                            },
                            "end": {
                                "x": 447,
                                "y": 744
                            },
                            "type": "normal",
                            "parent": 5,
                            "child": 1,
                            "angle": 1.5707963267948966,
                            "equations": {
                                "up": {
                                    "A": "v",
                                    "B": 457
                                },
                                "down": {
                                    "A": "v",
                                    "B": 437
                                },
                                "base": {
                                    "A": "v",
                                    "B": 447
                                }
                            },
                            "coords": [{
                                "x": 457,
                                "y": 468
                            }, {
                                "x": 437,
                                "y": 448
                            }, {
                                "x": 437,
                                "y": 754
                            }, {
                                "x": 457,
                                "y": 734
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 447,
                                "y": 744
                            },
                            "end": {
                                "x": 1347,
                                "y": 744
                            },
                            "type": "normal",
                            "parent": 0,
                            "child": 2,
                            "angle": 0,
                            "equations": {
                                "up": {
                                    "A": "h",
                                    "B": 734
                                },
                                "down": {
                                    "A": "h",
                                    "B": 754
                                },
                                "base": {
                                    "A": "h",
                                    "B": 744
                                }
                            },
                            "coords": [{
                                "x": 457,
                                "y": 734
                            }, {
                                "x": 437,
                                "y": 754
                            }, {
                                "x": 1357,
                                "y": 754
                            }, {
                                "x": 1337,
                                "y": 734
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1347,
                                "y": 744
                            },
                            "end": {
                                "x": 1347,
                                "y": 144
                            },
                            "type": "normal",
                            "parent": 1,
                            "child": 3,
                            "angle": -1.5707963267948966,
                            "equations": {
                                "up": {
                                    "A": "v",
                                    "B": 1337
                                },
                                "down": {
                                    "A": "v",
                                    "B": 1357
                                },
                                "base": {
                                    "A": "v",
                                    "B": 1347
                                }
                            },
                            "coords": [{
                                "x": 1337,
                                "y": 734
                            }, {
                                "x": 1357,
                                "y": 754
                            }, {
                                "x": 1357,
                                "y": 134
                            }, {
                                "x": 1337,
                                "y": 154
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1347,
                                "y": 144
                            },
                            "end": {
                                "x": 1020,
                                "y": 144
                            },
                            "type": "normal",
                            "parent": 2,
                            "child": 4,
                            "angle": 3.141592653589793,
                            "equations": {
                                "up": {
                                    "A": "h",
                                    "B": 154
                                },
                                "down": {
                                    "A": "h",
                                    "B": 134
                                },
                                "base": {
                                    "A": "h",
                                    "B": 144
                                }
                            },
                            "coords": [{
                                "x": 1337,
                                "y": 154
                            }, {
                                "x": 1357,
                                "y": 134
                            }, {
                                "x": 1010,
                                "y": 134
                            }, {
                                "x": 1030,
                                "y": 154
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1020,
                                "y": 144
                            },
                            "end": {
                                "x": 1020,
                                "y": 458
                            },
                            "type": "normal",
                            "parent": 3,
                            "child": 5,
                            "angle": 1.5707963267948966,
                            "equations": {
                                "up": {
                                    "A": "v",
                                    "B": 1030
                                },
                                "down": {
                                    "A": "v",
                                    "B": 1010
                                },
                                "base": {
                                    "A": "v",
                                    "B": 1020
                                }
                            },
                            "coords": [{
                                "x": 1030,
                                "y": 154
                            }, {
                                "x": 1010,
                                "y": 134
                            }, {
                                "x": 1010,
                                "y": 448
                            }, {
                                "x": 1030,
                                "y": 468
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }, {
                            "thick": 20,
                            "start": {
                                "x": 1020,
                                "y": 458
                            },
                            "end": {
                                "x": 447,
                                "y": 458
                            },
                            "type": "normal",
                            "parent": 4,
                            "child": 0,
                            "angle": 3.141592653589793,
                            "equations": {
                                "up": {
                                    "A": "h",
                                    "B": 468
                                },
                                "down": {
                                    "A": "h",
                                    "B": 448
                                },
                                "base": {
                                    "A": "h",
                                    "B": 458
                                }
                            },
                            "coords": [{
                                "x": 1030,
                                "y": 468
                            }, {
                                "x": 1010,
                                "y": 448
                            }, {
                                "x": 437,
                                "y": 448
                            }, {
                                "x": 457,
                                "y": 468
                            }],
                            "graph": {
                                "0": {},
                                "context": {},
                                "length": 1
                            }
                        }],
                        "roomData": [{
                            "coords": [{
                                "x": 447,
                                "y": 744
                            }, {
                                "x": 1347,
                                "y": 744
                            }, {
                                "x": 1347,
                                "y": 144
                            }, {
                                "x": 1020,
                                "y": 144
                            }, {
                                "x": 1020,
                                "y": 458
                            }, {
                                "x": 447,
                                "y": 458
                            }, {
                                "x": 447,
                                "y": 744
                            }],
                            "coordsOutside": [{
                                "x": 1357,
                                "y": 754
                            }, {
                                "x": 1357,
                                "y": 134
                            }, {
                                "x": 1010,
                                "y": 134
                            }, {
                                "x": 1010,
                                "y": 448
                            }, {
                                "x": 437,
                                "y": 448
                            }, {
                                "x": 437,
                                "y": 754
                            }, {
                                "x": 1357,
                                "y": 754
                            }],
                            "coordsInside": [{
                                "x": 1337,
                                "y": 734
                            }, {
                                "x": 1337,
                                "y": 154
                            }, {
                                "x": 1030,
                                "y": 154
                            }, {
                                "x": 1030,
                                "y": 468
                            }, {
                                "x": 457,
                                "y": 468
                            }, {
                                "x": 457,
                                "y": 734
                            }, {
                                "x": 1337,
                                "y": 734
                            }],
                            "inside": [],
                            "way": ["0", "2", "3", "4", "5", "1", "0"],
                            "area": 330478,
                            "surface": "",
                            "name": "",
                            "color": "gradientWhite",
                            "showSurface": true,
                            "action": "add"
                        }]
                    });
                    HISTORY[0] = JSON.stringify(HISTORY[0]);
                    localStorage.setItem('extension-floorplanner-history', JSON.stringify(HISTORY));
                    floorplanLoad(0);
                    floorplanSave();
                    save_to_floorplans();
                } else if (boot !== "recovery") {
                    floorplanSave();
                    save_to_floorplans();
                } else {
                    /*
                    WALLS = [];
                    OBJDATA = [];
                    ROOM = [];
                    HISTORY = [];
                    floorplanSave("boot");
                    */
                }


            }



            document.getElementById('extension-floorplanner-start-floorplanner-button').addEventListener("click", function() {
                start_floorplanner();
            });

            document.getElementById('extension-floorplanner-redo').addEventListener("click", function() {
                floorplanner_undo();
            });

            function floorplanner_undo() {
                //console.log("in floorplanner undo. HISTORY.index ?<? HISTORY.length", HISTORY.index, HISTORY.length);
                if (HISTORY.index < HISTORY.length) {
                    floorplanLoad(HISTORY.index);
                    HISTORY.index++;
                    document.querySelector('#extension-floorplanner-undo').classList.remove('extension-floorplanner-disabled');
                    if (HISTORY.index === HISTORY.length) {
                        document.querySelector('#extension-floorplanner-redo').classList.add('extension-floorplanner-disabled');
                    }
                }
            }

            document.getElementById('extension-floorplanner-undo').addEventListener("click", function() {
                floorplanner_redo();
            });

            function floorplanner_redo() {
                if (HISTORY.index > 0) {
                    document.querySelector('#extension-floorplanner-undo').classList.remove('extension-floorplanner-disabled');
                    if (HISTORY.index - 1 > 0) {
                        HISTORY.index--;
                        floorplanLoad(HISTORY.index - 1);
                        document.querySelector('#extension-floorplanner-redo').classList.remove('extension-floorplanner-disabled');
                    }
                }
                if (HISTORY.index === 1) document.querySelector('#extension-floorplanner-undo').classList.add('extension-floorplanner-disabled');
            }

            function floorplanSave(boot = false) {
                //console.log("\nin floorplanSave. boot: ", boot);
                //console.log("WALLS: ", WALLS);
                //console.log("OBJDATA: ", OBJDATA);
                //console.log("ROOM: ", ROOM);
                //console.log("HISTORY.length: ", HISTORY.length);
                if (!floorplanner_started) {
                    return
                }
                //console.log("HISTORY[HISTORY.length - 1]: ", HISTORY[HISTORY.length - 1]);
                //document.querySelector("g#extension-floorplanner-boxbind").replaceChildren();

                if (ROOM.length) {
                    root_el.classList.add('extension-floorplanner-has-room');
                } else {
                    root_el.classList.remove('extension-floorplanner-has-room');
                }


                if (boot) localStorage.removeItem('extension-floorplanner-history');
                // FOR CYCLIC OBJ INTO LOCALSTORAGE !!!
                for (let k in WALLS) {
                    if (WALLS[k].child != null) {
                        WALLS[k].child = WALLS.indexOf(WALLS[k].child);
                    }
                    if (WALLS[k].parent != null) {
                        WALLS[k].parent = WALLS.indexOf(WALLS[k].parent);
                    }
                }
                if (JSON.stringify({
                        objData: OBJDATA,
                        wallData: WALLS,
                        roomData: ROOM
                    }) === HISTORY[HISTORY.length - 1]) {
                    for (let k in WALLS) {
                        if (WALLS[k].child != null) {
                            WALLS[k].child = WALLS[WALLS[k].child];
                        }
                        if (WALLS[k].parent != null) {
                            WALLS[k].parent = WALLS[WALLS[k].parent];
                        }
                    }
                    //console.warn("not saving because no real change");
                    return false;
                }

                if (HISTORY.index < HISTORY.length) {
                    HISTORY.splice(HISTORY.index, (HISTORY.length - HISTORY.index));
                    document.querySelector('#extension-floorplanner-redo').classList.add('extension-floorplanner-disabled');
                }
                HISTORY.push(JSON.stringify({
                    objData: OBJDATA,
                    wallData: WALLS,
                    roomData: ROOM
                }));
                //console.log("pushed HISTORY: ", HISTORY);

                if (HISTORY.length > 10) {
                    HISTORY = HISTORY.slice(-10);
                }

                localStorage.setItem('extension-floorplanner-history', JSON.stringify(HISTORY));
                //console.log("localstorage: ", localStorage.getItem('extension-floorplanner-history'));
                HISTORY.index++;
                if (HISTORY.index > 1) document.querySelector('#extension-floorplanner-undo').classList.remove('extension-floorplanner-disabled');
                for (let k in WALLS) {
                    if (WALLS[k].child != null) {
                        WALLS[k].child = WALLS[WALLS[k].child];
                    }
                    if (WALLS[k].parent != null) {
                        WALLS[k].parent = WALLS[WALLS[k].parent];
                    }
                }

                if (settings.auto_save) {
                    //console.log("auto-saving to floorplans");
                    save_to_floorplans();
                }

                //generate_object_list();
                if (!boot) unsaved = true;
                return true;
            }


            function set_linked_scaling(state) {
                linked_scaling = state;
                if (state) {
                    root_el.classList.add('extension-floorplanner-scale-linked');
                } else {
                    root_el.classList.remove('extension-floorplanner-scale-linked');
                }
                /*
                if(typeof binder != 'undefined'){
                    if(typeof binder.update != 'undefined'){
                        binder.update();
                    }
                    if(typeof binder.obj != 'undefined' && typeof binder.obj.update != 'undefined'){
                        binder.obj.update();
                    }
                }
                */
            }


            function floorplanLoad(index = HISTORY.index, boot = false) {
                if (!floorplanner_started) {
                	console.error("floorplanner_started: floorplanner isn't technically started yet.. aborting.");
				    return
                }
				try{
	                set_linked_scaling(false);
	                if (HISTORY.length === 0 && !boot) {
	                    //console.error("floorplanLoad exited early. No history, and boot was false");
	                    return false;
	                };
	                for (let k in OBJDATA) {
	                    if (typeof OBJDATA[k].graph != 'undefined') {
	                        OBJDATA[k].graph.remove();
	                    }
	                }
	                OBJDATA = [];
	                let historyTemp = [];
	                if (localStorage.getItem('extension-floorplanner-history') != null) {
	                    historyTemp = JSON.parse(localStorage.getItem('extension-floorplanner-history'));
	                    historyTemp = JSON.parse(historyTemp[index]);

	                    //console.log("floorplanLoad: historyTemp: ", historyTemp);

	                    for (let k in historyTemp.objData) {
	                        let load = true;
	                        let OO = historyTemp.objData[k];
	                        //console.log("RESTORING OBJECTS. OO:", OO);
	                        if (OO.class == 'measure') {
	                            //console.warn("\n\nABOUT TO RESTORE MEASURE");
	                            //load = false;
	                            continue;
	                        }
							if (typeof OO.type != 'undefined' && OO.type == 'segment') {
								console.warn("somehow a segment was in the object data");
								continue;
							}
							
	                        //if (OO.family === 'energy') OO.family = 'byObject';
	                        let obj = new floorplanEditor.obj2D(OO.family, OO.class, OO.type, {
	                            x: OO.x,
	                            y: OO.y
	                        }, OO.angle, OO.angleSign, OO.size, OO.hinge = 'normal', OO.thick, OO.value, load); // true indicates this is a load, so to ignore the params size and thickness
	                        obj.limit = OO.limit;
	                        //console.log("obj.limit? ", obj.limit);
	                        OBJDATA.push(obj);

	                        if (obj.family == 'inWall') {
	                            document.querySelector('#extension-floorplanner-boxcarpentry').append(OBJDATA[OBJDATA.length - 1].graph);
	                        } else {
	                            //document.querySelector('#extension-floorplanner-boxEnergy').append(OBJDATA[OBJDATA.length - 1].graph);
	                            var targetBox = 'boxcarpentry';
	                            if (OBJDATA[OBJDATA.length - 1].class == 'text') targetBox = 'boxText';
	                            else if (OBJDATA[OBJDATA.length - 1].class == 'energy') targetBox = 'boxEnergy';
	                            else if (OBJDATA[OBJDATA.length - 1].class == 'furniture') targetBox = 'boxFurniture';
	                            else if (OBJDATA[OBJDATA.length - 1].class == 'measure') targetBox = 'boxMeasure';
	                            document.querySelector('g#extension-floorplanner-' + targetBox).append(OBJDATA[OBJDATA.length - 1].graph);
	                        }


	                        obj.update();
	                    }
	                    WALLS = historyTemp.wallData;
	                    for (let k in WALLS) {
	                        //console.log("recreating walls? WALLS[k]",WALLS[k]);
	                        if (WALLS[k].child != null) {
	                            WALLS[k].child = WALLS[WALLS[k].child];
	                        }
	                        if (WALLS[k].parent != null) {
	                            WALLS[k].parent = WALLS[WALLS[k].parent];
	                        }
	                    }
	                    ROOM = historyTemp.roomData;
	                    floorplanEditor.architect(WALLS);
	                    floorplanEditor.showScaleBox();
	                    rib();
	                }
	                //set_linked_scaling(true);
				}
                catch(e){
                	console.error("floorplanLoad: ", e);
                }
            }

            document.querySelectorAll('#extension-floorplanner-tool-root svg.extension-floorplanner-current-svg').forEach(function(element) {
                //console.error("SETTING VIEWBOX 1: ", originX_viewbox, originY_viewbox, width_viewbox, height_viewbox);
                element.setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox);
            });

            // **************************************************************************
            // *****************   FUNCTIONS ON BUTTON click     ************************
            // **************************************************************************

            document.getElementById('extension-floorplanner-report_mode').addEventListener("click", function() {
                if (typeof(globalArea) === "undefined") return false;
                mode = "report_mode";
                panel_el.style.display = 'none';
                document.querySelector('#extension-floorplanner-reportTools').style.display = 'block';
                document.getElementById('extension-floorplanner-reportTotalSurface').innerHTML = "Total surface : <b>" + (globalArea / 3600).toFixed(1) + "</b> m²";
                document.querySelector('#extension-floorplanner-reportTotalSurface').style.display = 'block';
                document.getElementById('extension-floorplanner-reportNumberSurface').innerHTML = "Number of rooms : <b>" + ROOM.length + "</b>";
                document.querySelector('#extension-floorplanner-reportNumberSurface').style.display = 'block';
                let number = 1;
                let reportRoom = '<div class="row">\n';
                for (let k in ROOM) {
                    let nameRoom = "Room n°" + number;
                    if (ROOM[k].name != "") nameRoom = ROOM[k].name;
                    reportRoom += '<div class="col-md-6"><p>' + nameRoom + '</p></div>\n';
                    reportRoom += '<div class="col-md-6"><p>Surface : <b>' + ((ROOM[k].area) / 3600).toFixed(2) + '</b> m²</p></div>\n';
                    number++;
                }
                reportRoom += '</div><hr/>\n';
                reportRoom += '<div>\n';
                let switchNumber = 0;
                let plugNumber = 0;
                let lampNumber = 0;
                for (let k in OBJDATA) {
                    if (OBJDATA[k].class === 'energy') {
                        if (OBJDATA[k].type === 'switch' || OBJDATA[k].type === 'doubleSwitch' || OBJDATA[k].type === 'dimmer') switchNumber++;
                        if (OBJDATA[k].type === 'plug' || OBJDATA[k].type === 'plug20' || OBJDATA[k].type === 'plug32') plugNumber++;
                        if (OBJDATA[k].type === 'wallLight' || OBJDATA[k].type === 'roofLight' || OBJDATA[k].type === 'standing-lamp') lampNumber++;
                    }
                }
                reportRoom += '<p>Switch number : ' + switchNumber + '</p>';
                reportRoom += '<p>Electric outlet number : ' + plugNumber + '</p>';
                reportRoom += '<p>Light point number : ' + lampNumber + '</p>';
                reportRoom += '</div>';
                reportRoom += '<div>\n';
                reportRoom += '<h2>Energy distribution per room</h2>\n';
                number = 1;
                reportRoom += '<div class="row">\n';
                reportRoom += '<div class="col-md-4"><p>Label</p></div>\n';
                reportRoom += '<div class="col-md-2"><small>Swi.</small></div>\n';
                reportRoom += '<div class="col-md-2"><small>Elec. out.</small></div>\n';
                reportRoom += '<div class="col-md-2"><small>Light.</small></div>\n';
                reportRoom += '<div class="col-md-2"><small>Watts Max</small></div>\n';
                reportRoom += '</div>';

                let roomEnergy = [];
                for (let k in ROOM) {
                    reportRoom += '<div class="row">\n';
                    let nameRoom = "Room n°" + number + " <small>(no name)</small>";
                    if (ROOM[k].name != "") nameRoom = ROOM[k].name;
                    reportRoom += '<div class="col-md-4"><p>' + nameRoom + '</p></div>\n';
                    switchNumber = 0;
                    plugNumber = 0;
                    let plug20 = 0;
                    let plug32 = 0;
                    lampNumber = 0;
                    let wattMax = 0;
                    let plug = false;
                    for (let i in OBJDATA) {
                        if (OBJDATA[i].class === 'energy') {
                            if (OBJDATA[i].type === 'switch' || OBJDATA[i].type === 'doubleSwitch' || OBJDATA[i].type === 'dimmer') {
                                if (roomTarget = floorplanEditor.rayCastingRoom(OBJDATA[i])) {
                                    if (isObjectsEquals(ROOM[k], roomTarget)) switchNumber++;
                                }
                            }
                            if (OBJDATA[i].type === 'plug' || OBJDATA[i].type === 'plug20' || OBJDATA[i].type === 'plug32') {
                                if (roomTarget = floorplanEditor.rayCastingRoom(OBJDATA[i])) {
                                    if (isObjectsEquals(ROOM[k], roomTarget)) {
                                        plugNumber++;
                                        if (OBJDATA[i].type === 'plug' && !plug) {
                                            wattMax += 3520;
                                            plug = true;
                                        }
                                        if (OBJDATA[i].type === 'plug20') {
                                            wattMax += 4400;
                                            plug20++;
                                        }
                                        if (OBJDATA[i].type === 'plug32') {
                                            wattMax += 7040;
                                            plug32++;
                                        }
                                    }
                                }
                            }
                            if (OBJDATA[i].type === 'wallLight' || OBJDATA[i].type === 'roofLight' || OBJDATA[i].type === 'standing-lamp') {
                                if (roomTarget = floorplanEditor.rayCastingRoom(OBJDATA[i])) {
                                    if (isObjectsEquals(ROOM[k], roomTarget)) {
                                        lampNumber++;
                                        wattMax += 100;
                                    }
                                }
                            }
                        }
                    }
                    roomEnergy.push({
                        switch: switchNumber,
                        plug: plugNumber,
                        plug20: plug20,
                        plug32: plug32,
                        light: lampNumber
                    });
                    reportRoom += '<div class="col-md-2"><b>' + switchNumber + '</b></div>\n';
                    reportRoom += '<div class="col-md-2"><b>' + plugNumber + '</b></div>\n';
                    reportRoom += '<div class="col-md-2"><b>' + lampNumber + '</b></div>\n';
                    reportRoom += '<div class="col-md-2"><b>' + wattMax + '</b></div>\n';
                    number++;
                    reportRoom += '</div>';
                }
                reportRoom += '<hr/><h2>Standard details NF C 15-100</h2>\n';
                number = 1;

                for (let k in ROOM) {
                    reportRoom += '<div class="row">\n';
                    let nfc = true;
                    let nameRoom = "Room n°" + number + " <small>(no name)</small>";
                    if (ROOM[k].name != "") nameRoom = ROOM[k].name;
                    reportRoom += '<div class="col-md-4"><p>' + nameRoom + '</p></div>\n';
                    if (ROOM[k].name === "") {
                        reportRoom +=
                            '<div class="col-md-8"><p><i class="fa fa-ban" aria-hidden="true" style="color:red"></i> The room has no label, Home Rough Editor cannot provide you with information.</p></div>\n';
                    } else {
                        if (ROOM[k].name === "Salon") {
                            for (let g in ROOM) {
                                if (ROOM[g].name === "Salle à manger") {
                                    roomEnergy[k].light += roomEnergy[g].light;
                                    roomEnergy[k].plug += roomEnergy[g].plug;
                                    roomEnergy[k].switch += roomEnergy[g].switch;
                                }
                            }
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug < 5) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>5 power outlets</b> <small>(actually ' +
                                    roomEnergy[k].plug + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                        if (ROOM[k].name === "Salle à manger") {
                            reportRoom +=
                                '<div class="col-md-8"><p><i class="fa fa-info" aria-hidden="true" style="color:blue"></i> This room is linked to the <b>living room / living room</b> according to the standard.</p></div>\n';
                        }
                        if (ROOM[k].name.substr(0, 7) === "Chambre") {
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug < 3) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>3 power outlets</b> <small>(actually ' +
                                    roomEnergy[k].plug + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                        if (ROOM[k].name === "SdB") {
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 light point</b> <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug < 2) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>2 power outlets</b> <small>(actually ' +
                                    roomEnergy[k].plug + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].switch === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 switch</b> <small>(actually ' +
                                    roomEnergy[k].switch+')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                        if (ROOM[k].name === "Couloir") {
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug < 1) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 power outlet</b> <small>(actually ' +
                                    roomEnergy[k].plug + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                        if (ROOM[k].name === "Toilette") {
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 light point</b>. <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                        if (ROOM[k].name === "Cuisine") {
                            reportRoom += '<div class="col-md-8">';
                            if (roomEnergy[k].light === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                                    roomEnergy[k].light + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug < 6) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>6 power outlets</b> <small>(actually ' +
                                    roomEnergy[k].plug + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug32 === 0) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 32A power outlet</b> <small>(actually ' +
                                    roomEnergy[k].plug32 + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (roomEnergy[k].plug20 < 2) {
                                reportRoom +=
                                    '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>2 20A power outlets</b> <small>(actually ' +
                                    roomEnergy[k].plug20 + ')</small>.</p>\n';
                                nfc = false;
                            }
                            if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
                            reportRoom += '</div>';
                        }
                    }
                    number++;
                    reportRoom += '</div>';
                }

                document.getElementById('extension-floorplanner-reportRooms').innerHTML = reportRoom;
                document.querySelector('#extension-floorplanner-reportRooms').style.display = 'block'
            });

            document.getElementById('extension-floorplanner-wallWidth').addEventListener("input", function(event) {
                let sliderValue = this.value;
                //console.log("sliderValue before: ", sliderValue);

                if (sliderValue > 20 - rotation_snappyness && sliderValue < 20 + rotation_snappyness) {
                    //console.log("snapping wall to 20");
                    sliderValue = 20;
                    document.getElementById('extension-floorplanner-wallWidth').value = sliderValue;
                }
                //console.log("sliderValue after: ", sliderValue);
                binder.wall.thick = sliderValue;
                binder.wall.type = "normal";
                floorplanEditor.architect(WALLS);
                let objWall = floorplanEditor.objFromWall(binder.wall); // LIST OBJ ON EDGE
                for (let w = 0; w < objWall.length; w++) {
                    objWall[w].thick = sliderValue;
                    objWall[w].update();
                }
                rib();
                document.getElementById("extension-floorplanner-wallWidthVal").textContent = sliderValue;
            });

            document.getElementById("extension-floorplanner-bboxTrash").addEventListener("click", function() {
                currently_editing_an_object = false;
                if (typeof binder.obj != 'undefined' && typeof binder.obj.graph != 'undefined') binder.obj.graph.remove();
                if (typeof binder.graph != 'undefined') binder.graph.remove();
                if (typeof binder.obj != 'undefined') OBJDATA.splice(OBJDATA.indexOf(binder.obj), 1);
                document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'none';
                panel_el.style.display = 'block';
                fonc_button('select_mode');
                box_info_el.innerHTML = 'Deleted object';
                //delete binder;
                bye_binder();
                rib();
            });

            document.getElementById("extension-floorplanner-bboxStepsAdd").addEventListener("click", function() {
                let newValue = document.getElementById("extension-floorplanner-bboxStepsVal").textContent;
                if (newValue < 15) {
                    newValue++;
                    binder.obj.value = newValue;
                    binder.obj.update();
                    document.getElementById("extension-floorplanner-bboxStepsVal").textContent = newValue;
                }
            });

            document.getElementById("extension-floorplanner-bboxStepsMinus").addEventListener("click", function() {
                let newValue = document.getElementById("extension-floorplanner-bboxStepsVal").textContent;
                if (newValue > 2) {
                    newValue--;
                    binder.obj.value = newValue;
                    binder.obj.update();
                    document.getElementById("extension-floorplanner-bboxStepsVal").textContent = newValue;
                }
            });

            document.getElementById('extension-floorplanner-bboxWidth').addEventListener("input", function() {
                let sliderValue = this.value;
				set_slider_scale(sliderValue);
            });

			function set_slider_scale(sliderValue=null){
				if(sliderValue == null){
					sliderValue = document.getElementById('extension-floorplanner-bboxWidth').value;
				}
                if (typeof binder != 'undefined' && typeof binder.obj != 'undefined') {
                    //let objTarget = binder.obj;
                    //console.log("new width scale WAIT NO: ", sliderValue / 100);
                    objTarget.size = (sliderValue / 100) * meter;
                    if (linked_scaling) {
                        objTarget.thick = (sliderValue / 100) * meter;
                    }
                    //objTarget.scale = {}
                    objTarget.update();
                    binder.size = (sliderValue / 100) * meter;
                    if (linked_scaling) {
                        binder.thick = (sliderValue / 100) * meter;
                    }
                    binder.update();
                    document.getElementById("extension-floorplanner-bboxWidthVal").textContent = sliderValue;
                    if (linked_scaling) {
                        document.getElementById('extension-floorplanner-bboxHeight').value = sliderValue;
                        document.getElementById("extension-floorplanner-bboxHeightVal").textContent = sliderValue;
                    }
                } else {
                    console.error("cannot scale object, no binder or binder.obj: ", binder);
                }
			}


            document.getElementById('extension-floorplanner-bboxHeight').addEventListener("input", function() {
                let sliderValue = this.value;
                //let objTarget = binder.obj;
                objTarget.thick = (sliderValue / 100) * meter;
                objTarget.update();
                binder.thick = (sliderValue / 100) * meter;
                binder.update();
                document.getElementById("extension-floorplanner-bboxHeightVal").textContent = sliderValue;
            });

            document.getElementById('extension-floorplanner-bboxRotation').addEventListener("input", function() {
                let sliderValue = this.value;

                if (sliderValue > -rotation_snappyness && sliderValue < rotation_snappyness) {
                    sliderValue = 0;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue > 90 - rotation_snappyness && sliderValue < 90 + rotation_snappyness) {
                    //console.log("optimizing");
                    sliderValue = 90;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue < -90 + rotation_snappyness && sliderValue > -90 - rotation_snappyness) {
                    sliderValue = -90;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue > 45 - rotation_snappyness && sliderValue < 45 + rotation_snappyness) {
                    //console.log("optimizing");
                    sliderValue = 45;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue < -40 + rotation_snappyness && sliderValue > -45 - rotation_snappyness) {
                    //console.log("optimizing");
                    sliderValue = -45;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue > 135 - rotation_snappyness && sliderValue < 135 + rotation_snappyness) {
                    //console.log("optimizing");
                    sliderValue = 135;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                } else if (sliderValue < -130 + rotation_snappyness && sliderValue > -135 - rotation_snappyness) {
                    //console.log("optimizing");
                    sliderValue = -135;
                    document.getElementById('extension-floorplanner-bboxRotationVal').textContent = sliderValue;
                    document.getElementById('extension-floorplanner-bboxRotation').value = sliderValue;
                }


                //let objTarget = binder.obj;
                objTarget.angle = sliderValue;
                objTarget.update();
                binder.angle = sliderValue;
                binder.update();
                document.getElementById("extension-floorplanner-bboxRotationVal").textContent = sliderValue;
            });

            document.getElementById('extension-floorplanner-doorWindowWidth').addEventListener("input", function() {
                let sliderValue = this.value;
                let objTarget = binder.obj;
                let wallBind = floorplanEditor.rayCastingWalls(objTarget, WALLS);
                if (wallBind.length > 1) {
                    wallBind = wallBind[wallBind.length - 1];
                }
                let limits = limitObj(wallBind.equations.base, sliderValue, objTarget);
                if (qSVG.btwn(limits[1].x, wallBind.start.x, wallBind.end.x) && qSVG.btwn(limits[1].y, wallBind.start.y, wallBind.end.y) &&
                    qSVG.btwn(limits[0].x, wallBind.start.x, wallBind.end.x) && qSVG.btwn(limits[0].y, wallBind.start.y, wallBind.end.y)) {
                    objTarget.size = sliderValue;
                    objTarget.limit = limits;
                    objTarget.update();
                    binder.size = sliderValue;
                    binder.limit = limits;
                    binder.update();
                    document.getElementById("extension-floorplanner-doorWindowWidthVal").textContent = sliderValue;
                }
                inWallRib(wallBind);
            });

            document.getElementById("extension-floorplanner-objToolsHinge").addEventListener("click", function() {
                //console.log("hinge change. binder: ", binder);
                //console.log("hinge change. binder.obj: ", binder.obj);
                let objTarget = binder.obj;
                let hingeStatus = objTarget.hinge; // normal - reverse
                if (hingeStatus === 'normal') {
                    objTarget.hinge = 'reverse';
                } else objTarget.hinge = 'normal';
                objTarget.update();
            });



            document.getElementById('extension-floorplanner-text-size-slider').addEventListener("input", function() {
                document.getElementById('extension-floorplanner-labelBox').style.fontSize = this.value + 'px';
            });


            document.querySelector('#extension-floorplanner-save-text').addEventListener("click", function(e) {
                //console.log("saving text");
                document.querySelector('#extension-floorplanner-textToLayer').style.display = 'none';
                fonc_button('select_mode');
                action = 0;
                let textToMake = document.getElementById('extension-floorplanner-labelBox').value; //textContent;

                //console.log("new text: ", textToMake);
                if (textToMake != "" && textToMake != "Your text") {
                    //console.log("creating text binder")
                    binder = new floorplanEditor.obj2D("free", "text", document.getElementById('extension-floorplanner-labelBox').style.color, snap, 0, 0, 0, "normal", 0, {
                        text: textToMake,
                        size: document.getElementById('extension-floorplanner-text-size-slider').value
                    });
                    //console.log("binder with text before update: ", binder);
                    binder.update();
                    //console.log("binder with text after update: ", binder);
                    OBJDATA.push(binder);
                    if (typeof binder.graph != 'undefined') binder.graph.remove();
                    document.querySelector('#extension-floorplanner-boxText').append(OBJDATA[OBJDATA.length - 1].graph);
                    OBJDATA[OBJDATA.length - 1].update();
                    //delete binder;
                    bye_binder();
                    box_info_el.innerHTML = 'Added text';
                    floorplanSave();
                } else {
                    console.warn("no relevant text provided");
                    box_info_el.innerHTML = 'Selection mode';
                }
                //document.getElementById('extension-floorplanner-labelBox').textContent = "Your text";
                document.getElementById('extension-floorplanner-labelBox').value == '';
                /*
			document.getElementById('extension-floorplanner-labelBox').style.color = "#333333";
			document.getElementById('extension-floorplanner-labelBox').style.fontSize = "15px";
			document.getElementById('extension-floorplanner-text-size-slider').value = 15;
			    */
            });


            // Cancel adding text
            document.querySelector('#extension-floorplanner-cancel-text').addEventListener("click", function(e) {
                //console.log("cancelling text");
                document.querySelector('#extension-floorplanner-textToLayer').style.display = 'none';
                fonc_button('select_mode');
                action = 0;

                //document.getElementById('extension-floorplanner-labelBox').textContent = "Your text";
                document.getElementById('extension-floorplanner-labelBox').value == '';
                document.getElementById('extension-floorplanner-labelBox').style.color = "#333333";
                document.getElementById('extension-floorplanner-labelBox').style.fontSize = "15px";
                document.getElementById('extension-floorplanner-text-size-slider').value = 15;
            });




            if (!Array.prototype.includes) {
                Object.defineProperty(Array.prototype, 'includes', {
                    value: function(searchElement, fromIndex) {
                        if (this === null) {
                            throw new TypeError('"this" is null or not defined');
                        }

                        let o = Object(this);
                        let len = o.length >>> 0;
                        if (len === 0) {
                            return false;
                        }
                        let n = fromIndex | 0;
                        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                        while (k < len) {
                            if (o[k] === searchElement) {
                                return true;
                            }
                            k++;
                        }
                        return false;
                    }
                });
            }

            function isObjectsEquals(a, b, message = false) {
                if (message) {
                    console.log("equals message: ", message);
                }
                let isOK = true;
                for (let prop in a) {
                    if (a[prop] !== b[prop]) {
                        isOK = false;
                        break;
                    }
                }
                return isOK;
            };

            function throttle(callback, delay) {
                let last;
                let timer;
                return function() {
                    let context = this;
                    let now = +new Date();
                    let args = arguments;
                    if (last && now < last + delay) {
                        // le délai n'est pas écoulé on reset le timer
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            last = now;
                            callback.apply(context, args);
                        }, delay);
                    } else {
                        last = now;
                        callback.apply(context, args);
                    }
                };
            }

            /*
            linElement.mousewheel(throttle(function (event) {
                event.preventDefault();
                if (event.deltaY > 0) {
                    zoom_maker('zoomin', 200);
                } else {
                    zoom_maker('zoomout', 200);
                }
            }, 100));
            */
            zoom_maker('zoomout', 200);

            document.getElementById("extension-floorplanner-showRib").addEventListener("click", function() {
                if (document.getElementById("extension-floorplanner-showRib").checked) {
                    document.querySelector('#extension-floorplanner-boxScale').style.display = 'block';
                    document.querySelector('#extension-floorplanner-boxRib').style.display = 'block';
                    document.querySelector('#extension-floorplanner-boxArea').style.display = 'block';
                    document.querySelector('#extension-floorplanner-boxMeasure').style.display = 'block';
                    document.querySelector('#extension-floorplanner-areaValue').style.display = 'block';
                    showRib = true;
                } else {
                    document.querySelector('#extension-floorplanner-boxScale').style.display = 'none';
                    document.querySelector('#extension-floorplanner-boxRib').style.display = 'none';
                    document.querySelector('#extension-floorplanner-boxArea').style.display = 'none';
                    document.querySelector('#extension-floorplanner-areaValue').style.display = 'none';
                    document.querySelector('#extension-floorplanner-boxMeasure').style.display = 'none';
                    showRib = false;
                }
            });

            /*
            document.getElementById("extension-floorplanner-showArea").addEventListener("click", function () {
                if (document.getElementById("extension-floorplanner-showArea").checked) {
                    document.querySelector('#extension-floorplanner-boxArea').style.display='block';
                } else {
                    document.querySelector('#extension-floorplanner-boxArea').style.display = 'none';
                }
            });
            */
            document.getElementById("extension-floorplanner-showLayerRoom").addEventListener("click", function() {
                if (document.getElementById("extension-floorplanner-showLayerRoom").checked) {
                    document.querySelector('#extension-floorplanner-boxRoom').style.display = 'block';
                } else {
                    document.querySelector('#extension-floorplanner-boxRoom').style.display = 'none';
                }
            });

            document.getElementById("extension-floorplanner-showLayerEnergy").addEventListener("click", function() {
                //console.log("toggling energy/furniture layer");
                if (document.getElementById("extension-floorplanner-showLayerEnergy").checked) {
                    //console.log("showing furniture");
                    document.querySelector('#extension-floorplanner-boxEnergy').style.display = 'block';
                    //document.querySelector('#extension-floorplanner-boxcarpentry').style.display='block';
                } else {
                    //console.log("hiding furniture");
                    document.querySelector('#extension-floorplanner-boxEnergy').style.display = 'none';
                    //document.querySelector('#extension-floorplanner-boxcarpentry').style.display = 'none';
                }
            });

            // document.getElementById("showLayerFurniture").addEventListener("click", function () {
            //   if (document.getElementById("showLayerFurniture").checked) {
            //     document.querySelector('#extension-floorplanner-boxFurniture').style.display='block';
            //   }
            //   else {
            //     document.querySelector('#extension-floorplanner-boxFurniture').style.display = 'none';
            //   }
            // });

            document.getElementById("extension-floorplanner-applySurface").addEventListener("click", function() {
                change_room_background();
            });


            function change_room_background() {
                document.querySelector('#extension-floorplanner-roomTools').style.display = 'none';
                panel_el.style.display = 'block';
                //binder.remove();
                //delete binder;
                bye_binder();
                let id = document.querySelector('#extension-floorplanner-roomIndex').value;
                //console.log("roomIndex: ", id);
                //COLOR
                let data = document.querySelector('#extension-floorplanner-roomBackground').value;
                ROOM[id].color = "extension-floorplanner-" + data;
                //ROOM NAME
                let roomName = document.querySelector('#extension-floorplanner-roomName').value;
                if (roomName === 'None') {
                    roomName = '';
                }
                ROOM[id].name = roomName;
                //ROOM SURFACE
                let area = document.querySelector('#extension-floorplanner-roomSurface').value;
                ROOM[id].surface = area;
                //SHOW SURFACE
                let show = document.querySelector("#extension-floorplanner-seeArea").checked;
                ROOM[id].showSurface = show;
                //ACTION PARAM
                let action = document.querySelector('#extension-floorplanner-tool-root input[type=radio]:checked').value;
                ROOM[id].action = action;
                if (action === 'sub') {
                    ROOM[id].color = 'hatch';
                }
                if (action != 'sub' && data === 'hatch') {
                    ROOM[id].color = 'gradientNeutral';
                }
                document.querySelector('#extension-floorplanner-boxRoom').replaceChildren();
                document.querySelector('#extension-floorplanner-boxSurface').replaceChildren();
                floorplanEditor.roomMaker(Rooms);
                box_info_el.innerHTML = 'Updated room';
                fonc_button('select_mode');
            }

            document.getElementById("extension-floorplanner-resetRoomTools").addEventListener("click", function() {
                document.querySelector('#extension-floorplanner-roomTools').style.display = 'none';
                panel_el.style.display = 'block';
                //binder.remove();
                //delete binder;
                bye_binder();
                box_info_el.innerHTML = 'Updated room';
                fonc_button('select_mode');

            });

            document.getElementById("extension-floorplanner-wallTrash").addEventListener("click", function() {
                let wall = binder.wall;
                for (let k in WALLS) {
                    if (isObjectsEquals(WALLS[k].child, wall)) WALLS[k].child = null;
                    if (isObjectsEquals(WALLS[k].parent, wall)) {
                        WALLS[k].parent = null;
                    }
                }
                WALLS.splice(WALLS.indexOf(wall), 1);
                document.querySelector('#extension-floorplanner-wallTools').style.display = 'none';
                wall.graph.remove();
                binder.graph.remove();
                floorplanEditor.architect(WALLS);
                rib();
                mode = "select_mode";
                panel_el.style.display = 'block';
            });

            let textEditorColorBtn = document.querySelectorAll('.extension-floorplanner-textEditorColor');
            for (let k = 0; k < textEditorColorBtn.length; k++) {
                textEditorColorBtn[k].addEventListener('click', function() {
                    document.getElementById('extension-floorplanner-labelBox').style.color = this.style.color;
                });
            }

            let zoomBtn = document.querySelectorAll('.extension-floorplanner-zoom');
            //console.log("zoomBtn: ", zoomBtn);
            for (let k = 0; k < zoomBtn.length; k++) {
                zoomBtn[k].addEventListener("click", function() {
                    let lens = this.getAttribute('data-zoom');
                    zoom_maker(lens, 200, 50);
                })
            }

            let roomColorBtn = document.querySelectorAll(".extension-floorplanner-roomColor");
            for (let k = 0; k < roomColorBtn.length; k++) {
                roomColorBtn[k].addEventListener("click", function(event) {
                    let data = event.target.getAttribute('data-type');
                    //console.log("clicked on roomcolor button. data: ", data);
                    //console.log("--document.querySelector('#extension-floorplanner-roomBackground'): ", document.querySelector('#extension-floorplanner-roomBackground'));
                    //console.log("--BINDER: ", binder);
                    document.querySelector('#extension-floorplanner-roomBackground').value = data;
                    binder.setAttribute('fill', 'url(#extension-floorplanner-' + data + ')');
                    change_room_background();
                });
            }

            let objTrashBtn = document.querySelectorAll(".extension-floorplanner-objTrash");
            for (let k = 0; k < objTrashBtn.length; k++) {
                objTrashBtn[k].addEventListener("click", function() {
                    document.querySelector('#extension-floorplanner-objTools').style.display = 'none';
                    let obj = binder.obj;
                    obj.graph.remove();
                    OBJDATA.splice(OBJDATA.indexOf(obj), 1);
                    fonc_button('select_mode');
                    box_info_el.innerHTML = 'Selection mode';
                    panel_el.style.display = 'block';
                    if (typeof binder.graph != 'undefined') binder.graph.remove();
                    //delete binder;
                    bye_binder();
                    rib();
                    panel_el.style.display = 'block';
                });
            }

            let dropdownMenu = document.querySelectorAll(".extension-floorplanner-dropdown-menu li a");
            for (let k = 0; k < dropdownMenu.length; k++) {
                dropdownMenu[k].addEventListener("click", function() {
                    let selText = this.textContent;
                    // TODO: is parents van jquery?
                    document.querySelector(this).closest('.extension-floorplanner-btn-group').querySelector('.extension-floorplanner-dropdown-toggle').innerHTML = selText + ' <span class="caret"></span>';
                    if (selText != 'None') document.querySelector('#extension-floorplanner-roomName').value = selText;
                    else document.querySelector('#extension-floorplanner-roomName').value = '';
                });
            }

            // TRY MATRIX CALC FOR BBOX REAL COORDS WITH TRAS + ROT.
            function matrixCalc(el, message = false) {
                if (message) {
                    console.log("matrixCalc called by -> ", message);
                }
                let m = el.getCTM();
                let bb = el.getBBox();
                let tpts = [
                    matrixXY(m, bb.x, bb.y),
                    matrixXY(m, bb.x + bb.width, bb.y),
                    matrixXY(m, bb.x + bb.width, bb.y + bb.height),
                    matrixXY(m, bb.x, bb.y + bb.height)
                ];
                return tpts;
            }

            function matrixXY(m, x, y) {
                return {
                    x: x * m.a + y * m.c + m.e,
                    y: x * m.b + y * m.d + m.f
                };
            }

            function realBboxShow(coords) {
                for (let k in coords) {
                    debugPoint(coords[k]);
                }
            }


            function limitObj(equation, size, coords, message = false) {
                if (message) {
                    //console.log("limitObj: message: ", message);
                }
                let Px = coords.x;
                let Py = coords.y;
                let Aq = equation.A;
                let Bq = equation.B;
                let pos1, pos2;
                if (Aq === 'v') {
                    pos1 = {
                        x: Px,
                        y: Py - size / 2
                    };
                    pos2 = {
                        x: Px,
                        y: Py + size / 2
                    };
                } else if (Aq === 'h') {
                    pos1 = {
                        x: Px - size / 2,
                        y: Py
                    };
                    pos2 = {
                        x: Px + size / 2,
                        y: Py
                    };
                } else {
                    let A = 1 + Aq * Aq;
                    let B = (-2 * Px) + (2 * Aq * Bq) + (-2 * Py * Aq);
                    let C = (Px * Px) + (Bq * Bq) - (2 * Py * Bq) + (Py * Py) - (size * size) / 4; // -N
                    let Delta = (B * B) - (4 * A * C);
                    let posX1 = (-B - (Math.sqrt(Delta))) / (2 * A);
                    let posX2 = (-B + (Math.sqrt(Delta))) / (2 * A);
                    pos1 = {
                        x: posX1,
                        y: (Aq * posX1) + Bq
                    };
                    pos2 = {
                        x: posX2,
                        y: (Aq * posX2) + Bq
                    };
                }
                return [pos1, pos2];
            }

            function zoom_maker(lens, xmove, xview) {

				if(floorplanner_started == false){
					//console.log("zoom_maker: aborting, not officially started yet");
					return;
				}

                if (Math.abs(xmove) > 200 || Math.abs(xview) > 200) {
                    //console.warn("zoom_maker: unlikely move speed");
                    return
                }

                //console.log("in zoom_maker.  lens, xmove, xview: ", lens, xmove, xview);
                if (lens === 'zoomout' && zoom > 1 && zoom < 17) {
                    zoom--;
                    width_viewbox += xmove;
                    let ratioWidthZoom = taille_w / width_viewbox;
                    height_viewbox = width_viewbox * ratio_viewbox;
                    let myDiv = document.getElementById("extension-floorplanner-scaleVal");
                    myDiv.style.width = 60 * ratioWidthZoom + 'px';
                    originX_viewbox = originX_viewbox - (xmove / 2);
                    originY_viewbox = originY_viewbox - (xmove / 2 * ratio_viewbox);
                }
                if (lens === 'zoomin' && zoom < 14 && zoom > 0) {
                    zoom++;
                    let oldWidth = width_viewbox;
                    width_viewbox -= xmove;
                    let ratioWidthZoom = taille_w / width_viewbox;
                    height_viewbox = width_viewbox * ratio_viewbox;
                    let myDiv = document.getElementById("extension-floorplanner-scaleVal");
                    myDiv.style.width = 60 * ratioWidthZoom + 'px';

                    originX_viewbox = originX_viewbox + (xmove / 2);
                    originY_viewbox = originY_viewbox + (xmove / 2 * ratio_viewbox);
                }
                factor = width_viewbox / taille_w;
                //console.log("zoom factor: ", factor);
                if (factor < 0) {
                    //console.warn("zoom_maker: factor was below 1, forcing zoomreset");
                    factor = 1;
                    lens = 'zoomreset';
                }
                if (lens === 'zoomreset') {
                    //console.warn("zoom_maker: zoomreset");
                    originX_viewbox = 0;
                    originY_viewbox = 0;
                    width_viewbox = taille_w;
                    height_viewbox = taille_h;
                    factor = 1;
                    /*
			            zoom = 9;
			            let ratioWidthZoom = taille_w / width_viewbox;
			    myDiv = document.getElementById("extension-floorplanner-scaleVal");
			    myDiv.style.width = 60 * ratioWidthZoom + 'px';
			            */
                }
                if (lens === 'zoomright') {
                    originX_viewbox += xview;
                }
                if (lens === 'zoomleft') {
                    originX_viewbox -= xview;
                }
                if (lens === 'zoomtop') {
                    originY_viewbox -= xview;
                }
                if (lens === 'zoombottom') {
                    originY_viewbox += xview;
                }
                if (lens === 'zoomdrag') {
                    originX_viewbox -= xmove;
                    originY_viewbox -= xview;
                }
                document.querySelectorAll('#extension-floorplanner-tool-root svg.extension-floorplanner-current-svg').forEach(function(element) {
                    //console.log("CHANGING VIEWBOX. element: ", element);
                    //console.error("!!! SETTING VIEWBOX 2: ", originX_viewbox, originY_viewbox, width_viewbox,height_viewbox);
                    element.setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox);
                });
            }



            function calcul_snap(event, state) {
                //console.log("calcul_snap:  event, state:",event, state);
                let eX, eY, x_mouse, y_mouse, x_grid, y_grid;
                if (event.touches) {
                    let touches = event.changedTouches;
                    //console.log("calcul_snap touches");
                    eX = touches[0].pageX;
                    eY = touches[0].pageY;
                    tactile = true;
                } else {
                    eX = event.pageX;
                    eY = event.pageY;
                }
                x_mouse = (eX * factor) - (offset.left * factor) + originX_viewbox;
                y_mouse = (eY * factor) - (offset.top * factor) + originY_viewbox;
                //console.log("calculsnap: x_mouse: ", x_mouse);
                //console.log("calculsnap: y_mouse: ", y_mouse);

                if (state === 'on') {
                    x_grid = Math.round(x_mouse / grid) * grid;
                    y_grid = Math.round(y_mouse / grid) * grid;
                }
                if (state === 'off') {
                    x_grid = x_mouse;
                    y_grid = y_mouse;
                }
                return {
                    x: x_grid,
                    y: y_grid,
                    xMouse: x_mouse,
                    yMouse: y_mouse
                };
            }

            let minMoveGrid = function(mouse) {
                return Math.abs(Math.abs(pox - mouse.x) + Math.abs(poy - mouse.y));
            }

            function intersectionOff() {
                if (typeof(lineIntersectionP) != 'undefined') {
                    try {
                        lineIntersectionP.remove();
                        //delete lineIntersectionP;
                    } catch (e) {
                        console.error("cannot delete lineIntersectionP: ", e)
                    }
                    //delete lineIntersectionP;
                }
            }

            function intersection(snap, range = Infinity, except = ['']) {
                // ORANGE LINES 90° NEAR SEGMENT
                let bestEqPoint = {};
                let equation = {};

                bestEqPoint.distance = range;

                if (typeof(lineIntersectionP) != 'undefined') {
                    lineIntersectionP.remove();
                    //delete lineIntersectionP;
                }

                lineIntersectionP = qSVG.create("boxbind", "path", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
                    d: "",
                    "stroke": "transparent",
                    "stroke-width": 0.5,
                    "stroke-opacity": "1",
                    fill: "none"
                });

                for (let index = 0; index < WALLS.length; index++) {
                    if (except.indexOf(WALLS[index]) === -1) {
                        let x1 = WALLS[index].start.x;
                        let y1 = WALLS[index].start.y;
                        let x2 = WALLS[index].end.x;
                        let y2 = WALLS[index].end.y;

                        // EQUATION 90° of segment nf/nf-1 at X2/Y2 Point
                        if (Math.abs(y2 - y1) === 0) {
                            equation.C = 'v'; // C/D equation 90° Coef = -1/E
                            equation.D = x1;
                            equation.E = 'h'; // E/F equation Segment
                            equation.F = y1;
                            equation.G = 'v'; // G/H equation 90° Coef = -1/E
                            equation.H = x2;
                            equation.I = 'h'; // I/J equation Segment
                            equation.J = y2;
                        } else if (Math.abs(x2 - x1) === 0) {
                            equation.C = 'h'; // C/D equation 90° Coef = -1/E
                            equation.D = y1;
                            equation.E = 'v'; // E/F equation Segment
                            equation.F = x1;
                            equation.G = 'h'; // G/H equation 90° Coef = -1/E
                            equation.H = y2;
                            equation.I = 'v'; // I/J equation Segment
                            equation.J = x2;
                        } else {
                            equation.C = (x1 - x2) / (y2 - y1);
                            equation.D = y1 - (x1 * equation.C);
                            equation.E = (y2 - y1) / (x2 - x1);
                            equation.F = y1 - (x1 * equation.E);
                            equation.G = (x1 - x2) / (y2 - y1);
                            equation.H = y2 - (x2 * equation.C);
                            equation.I = (y2 - y1) / (x2 - x1);
                            equation.J = y2 - (x2 * equation.E);
                        }
                        equation.A = equation.C;
                        equation.B = equation.D;
                        eq = qSVG.nearPointOnEquation(equation, snap);
                        if (eq.distance < bestEqPoint.distance) {
                            setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 1);
                        }
                        equation.A = equation.E;
                        equation.B = equation.F;
                        eq = qSVG.nearPointOnEquation(equation, snap);
                        if (eq.distance < bestEqPoint.distance) {
                            setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 1);
                        }
                        equation.A = equation.G;
                        equation.B = equation.H;
                        eq = qSVG.nearPointOnEquation(equation, snap);
                        if (eq.distance < bestEqPoint.distance) {
                            setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 2);
                        }
                        equation.A = equation.I;
                        equation.B = equation.J;
                        eq = qSVG.nearPointOnEquation(equation, snap);
                        if (eq.distance < bestEqPoint.distance) {
                            setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 2);
                        }
                    } // END INDEXOF EXCEPT TEST
                } // END LOOP FOR

                if (bestEqPoint.distance < range) {
                    if (bestEqPoint.way === 2) {
                        lineIntersectionP.setAttribute("d", "M" + bestEqPoint.x1 + "," + bestEqPoint.y1 + " L" + bestEqPoint.x2 + "," + bestEqPoint.y2 + " L" + bestEqPoint.x + "," + bestEqPoint.y);
                        lineIntersectionP.setAttribute("stroke", "#d7ac57");
                    } else {
                        // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
                        lineIntersectionP.setAttribute("d", "M" + bestEqPoint.x2 + "," + bestEqPoint.y2 + " L" + bestEqPoint.x1 + "," + bestEqPoint.y1 + " L" + bestEqPoint.x + "," + bestEqPoint.y);
                        lineIntersectionP.setAttribute("stroke", "#d7ac57");
                    }
                    return ({
                        x: bestEqPoint.x,
                        y: bestEqPoint.y,
                        wall: WALLS[bestEqPoint.node],
                        distance: bestEqPoint.distance
                    });
                } else {
                    return false;
                }
            }

            function debugPoint(point, name, color = "#00ff00") {
                //console.warn("in debugPoint. point, name, color: ", point, name, color);
                qSVG.create('boxDebug', 'circle', {
                    cx: point.x,
                    cy: point.y,
                    r: 7,
                    fill: color,
                    id: name,
                    class: "extension-floorplanner-visu"
                });
            }

            function showVertex() {
                for (let i = 0; i < vertex.length; i++) {
                    debugPoint(vertex[i], i);

                }
            }

            function showJunction() {
                for (let i = 0; i < junction.length; i++) {
                    debugPoint({
                        x: junction[i].values[0],
                        y: junction[i].values[1]
                    }, i);

                }
            }



            function hideAllSize() {
                document.querySelector('#extension-floorplanner-boxbind').replaceChildren(); //.innerHTML = '';
                sizeText = [];
                showAllSizeStatus = 0;
            }

            function allRib() {
                document.querySelector('#extension-floorplanner-boxRib').replaceChildren(); //.innerHTML = '';
                for (let i in WALLS) {
                    inWallRib(WALLS[i], 'all');
                }
            }

            function inWallRib(wall, option = false) {
                //console.log("inWallRib:  wall, option:",wall, option);
                if (!option) document.querySelector('#extension-floorplanner-boxRib').replaceChildren(); //.innerHTML = '';
                let ribMaster = [];
                ribMaster.push([]);
                ribMaster.push([]);
                let inter;
                let distance;
                let cross;
                let angleTextValue = wall.angle * (180 / Math.PI);
                let objWall = floorplanEditor.objFromWall(wall); // LIST OBJ ON EDGE
                if (objWall.length == 0) return
                ribMaster[0].push({
                    wall: wall,
                    crossObj: false,
                    side: 'up',
                    coords: wall.coords[0],
                    distance: 0
                });
                ribMaster[1].push({
                    wall: wall,
                    crossObj: false,
                    side: 'down',
                    coords: wall.coords[1],
                    distance: 0
                });
                //let objTarget = null
                for (let ob in objWall) {
                    objTarget = objWall[ob];
                    objTarget.up = [
                        qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[0]),
                        qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[1])
                    ];
                    objTarget.down = [
                        qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[0]),
                        qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[1])
                    ];

                    distance = qSVG.measure(wall.coords[0], objTarget.up[0]) / meter;
                    ribMaster[0].push({
                        wall: objTarget,
                        crossObj: ob,
                        side: 'up',
                        coords: objTarget.up[0],
                        distance: distance.toFixed(2)
                    });
                    distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
                    ribMaster[0].push({
                        wall: objTarget,
                        crossObj: ob,
                        side: 'up',
                        coords: objTarget.up[1],
                        distance: distance.toFixed(2)
                    });
                    distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
                    ribMaster[1].push({
                        wall: objTarget,
                        crossObj: ob,
                        side: 'down',
                        coords: objTarget.down[0],
                        distance: distance.toFixed(2)
                    });
                    distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
                    ribMaster[1].push({
                        wall: objTarget,
                        crossObj: ob,
                        side: 'down',
                        coords: objTarget.down[1],
                        distance: distance.toFixed(2)
                    });
                }
                distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
                ribMaster[0].push({
                    wall: objTarget,
                    crossObj: false,
                    side: 'up',
                    coords: wall.coords[3],
                    distance: distance
                });
                distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
                ribMaster[1].push({
                    wall: objTarget,
                    crossObj: false,
                    side: 'down',
                    coords: wall.coords[2],
                    distance: distance
                });
                ribMaster[0].sort(function(a, b) {
                    return (a.distance - b.distance).toFixed(2);
                });
                ribMaster[1].sort(function(a, b) {
                    return (a.distance - b.distance).toFixed(2);
                });
                for (let t in ribMaster) {
                    for (let n = 1; n < ribMaster[t].length; n++) {
                        let found = true;
                        let shift = -5;
                        let valueText = Math.abs(ribMaster[t][n - 1].distance - ribMaster[t][n].distance);
                        let angleText = angleTextValue;
                        if (found) {
                            if (ribMaster[t][n - 1].side === 'down') {
                                shift = -shift + 10;
                            }
                            if (angleText > 89 || angleText < -89) {
                                angleText -= 180;
                                if (ribMaster[t][n - 1].side === 'down') {
                                    shift = -5;
                                } else shift = -shift + 10;
                            }


                            sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            let startText = qSVG.middle(ribMaster[t][n - 1].coords.x, ribMaster[t][n - 1].coords.y, ribMaster[t][n].coords.x, ribMaster[t][n].coords.y);
                            sizeText[n].setAttributeNS(null, 'x', startText.x);
                            sizeText[n].setAttributeNS(null, 'y', (startText.y) + shift);
                            sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
                            sizeText[n].setAttributeNS(null, 'font-family', 'sans-serif');
                            sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
                            sizeText[n].textContent = valueText.toFixed(2);
                            if (sizeText[n].textContent < 1) {
                                sizeText[n].setAttributeNS(null, 'font-size', '0.8em');
                                sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
                            } else sizeText[n].setAttributeNS(null, 'font-size', '1em');
                            sizeText[n].setAttributeNS(null, 'stroke-width', '0.27px');
                            sizeText[n].setAttributeNS(null, 'fill', '#666666');
                            sizeText[n].setAttribute("transform", "rotate(" + angleText + " " + startText.x + "," + (startText.y) + ")");

                            document.querySelector('#extension-floorplanner-boxRib').append(sizeText[n]);
                        }
                    }
                }
            }

            function rib(shift = 5) {
                //console.log("in rib. shift (5 by defalt): ", shift);
                // return false;
                let ribMaster = [];
                ribMaster.push([]);
                ribMaster.push([]);
                let inter;
                let distance;
                let cross;
                for (let i in WALLS) {
                    if (WALLS[i].equations.base) {
                        ribMaster[0].push([]);
                        pushToRibMaster(ribMaster, 0, i, i, i, 'up', WALLS[i].coords[0], 0);
                        ribMaster[1].push([]);
                        pushToRibMaster(ribMaster, 1, i, i, i, 'down', WALLS[i].coords[1], 0);

                        for (let p in WALLS) {
                            if (i != p && WALLS[p].equations.base) {
                                cross = qSVG.intersectionOfEquations(WALLS[i].equations.base, WALLS[p].equations.base, "object");
                                if (qSVG.btwn(cross.x, WALLS[i].start.x, WALLS[i].end.x, 'round') &&
                                    qSVG.btwn(cross.y, WALLS[i].start.y, WALLS[i].end.y, 'round')) {

                                    inter = qSVG.intersectionOfEquations(WALLS[i].equations.up, WALLS[p].equations.up, "object");
                                    if (qSVG.btwn(inter.x, WALLS[i].coords[0].x, WALLS[i].coords[3].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[i].coords[0].y, WALLS[i].coords[3].y, 'round') &&
                                        qSVG.btwn(inter.x, WALLS[p].coords[0].x, WALLS[p].coords[3].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[p].coords[0].y, WALLS[p].coords[3].y, 'round')) {
                                        distance = qSVG.measure(WALLS[i].coords[0], inter) / meter;
                                        pushToRibMaster(ribMaster, 0, i, i, p, 'up', inter, distance.toFixed(2));

                                    }

                                    inter = qSVG.intersectionOfEquations(WALLS[i].equations.up, WALLS[p].equations.down, "object");
                                    if (qSVG.btwn(inter.x, WALLS[i].coords[0].x, WALLS[i].coords[3].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[i].coords[0].y, WALLS[i].coords[3].y, 'round') &&
                                        qSVG.btwn(inter.x, WALLS[p].coords[1].x, WALLS[p].coords[2].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[p].coords[1].y, WALLS[p].coords[2].y, 'round')) {
                                        distance = qSVG.measure(WALLS[i].coords[0], inter) / meter;
                                        pushToRibMaster(ribMaster, 0, i, i, p, 'up', inter, distance.toFixed(2));

                                    }

                                    inter = qSVG.intersectionOfEquations(WALLS[i].equations.down, WALLS[p].equations.up, "object");
                                    if (qSVG.btwn(inter.x, WALLS[i].coords[1].x, WALLS[i].coords[2].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[i].coords[1].y, WALLS[i].coords[2].y, 'round') &&
                                        qSVG.btwn(inter.x, WALLS[p].coords[0].x, WALLS[p].coords[3].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[p].coords[0].y, WALLS[p].coords[3].y, 'round')) {
                                        distance = qSVG.measure(WALLS[i].coords[1], inter) / meter;
                                        pushToRibMaster(ribMaster, 1, i, i, p, 'down', inter, distance.toFixed(2));

                                    }

                                    inter = qSVG.intersectionOfEquations(WALLS[i].equations.down, WALLS[p].equations.down, "object");
                                    if (qSVG.btwn(inter.x, WALLS[i].coords[1].x, WALLS[i].coords[2].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[i].coords[1].y, WALLS[i].coords[2].y, 'round') &&
                                        qSVG.btwn(inter.x, WALLS[p].coords[1].x, WALLS[p].coords[2].x, 'round') &&
                                        qSVG.btwn(inter.y, WALLS[p].coords[1].y, WALLS[p].coords[2].y, 'round')) {
                                        distance = qSVG.measure(WALLS[i].coords[1], inter) / meter;
                                        pushToRibMaster(ribMaster, 1, i, i, p, 'down', inter, distance.toFixed(2));

                                    }
                                }
                            }
                        }
                        distance = qSVG.measure(WALLS[i].coords[0], WALLS[i].coords[3]) / meter;
                        pushToRibMaster(ribMaster, 0, i, i, i, 'up', WALLS[i].coords[3], distance.toFixed(2));

                        distance = qSVG.measure(WALLS[i].coords[1], WALLS[i].coords[2]) / meter;
                        pushToRibMaster(ribMaster, 1, i, i, i, 'down', WALLS[i].coords[2], distance.toFixed(2));
                    }
                }

                for (let a in ribMaster[0]) {
                    ribMaster[0][a].sort(function(a, b) {
                        return (a.distance - b.distance).toFixed(2);
                    });
                }
                for (let a in ribMaster[1]) {
                    ribMaster[1][a].sort(function(a, b) {
                        return (a.distance - b.distance).toFixed(2);
                    });
                }

                let sizeText = [];
                if (shift === 5) document.querySelector('#extension-floorplanner-boxRib').replaceChildren(); //.innerHTML = '';
                for (let t in ribMaster) {
                    for (let a in ribMaster[t]) {
                        for (let n = 1; n < ribMaster[t][a].length; n++) {
                            if (ribMaster[t][a][n - 1].wallIndex === ribMaster[t][a][n].wallIndex) {
                                let edge = ribMaster[t][a][n].wallIndex;
                                let found = true;
                                let valueText = Math.abs(ribMaster[t][a][n - 1].distance - ribMaster[t][a][n].distance);
                                // CLEAR TOO LITTLE VALUE
                                if (valueText < 0.15) {
                                    found = false;
                                }
                                // CLEAR (thick) BETWEEN CROSS EDGE
                                if (found && ribMaster[t][a][n - 1].crossEdge === ribMaster[t][a][n].crossEdge && ribMaster[t][a][n].crossEdge !=
                                    ribMaster[t][a][n].wallIndex) {
                                    found = false;
                                }
                                // CLEAR START INTO EDGE
                                if (found && ribMaster[t][a].length > 2 && n === 1) {
                                    let polygon = [];
                                    for (let pp = 0; pp < 4; pp++) {
                                        polygon.push({
                                            x: WALLS[ribMaster[t][a][n].crossEdge].coords[pp].x,
                                            y: WALLS[ribMaster[t][a][n].crossEdge].coords[pp].y
                                        }); // FOR Z
                                    }
                                    if (qSVG.rayCasting(ribMaster[t][a][0].coords, polygon)) {
                                        found = false;
                                    }
                                }
                                // CLEAR END INTO EDGE
                                if (found && ribMaster[t][a].length > 2 && n === ribMaster[t][a].length - 1) {
                                    let polygon = [];
                                    for (let pp = 0; pp < 4; pp++) {
                                        polygon.push({
                                            x: WALLS[ribMaster[t][a][n - 1].crossEdge].coords[pp].x,
                                            y: WALLS[ribMaster[t][a][n - 1].crossEdge].coords[pp].y
                                        }); // FOR Z
                                    }
                                    if (qSVG.rayCasting(ribMaster[t][a][ribMaster[t][a].length - 1].coords, polygon)) {
                                        found = false;
                                    }
                                }

                                if (found) {
                                    let angleText = WALLS[ribMaster[t][a][n].wallIndex].angle * (180 / Math.PI);
                                    let shiftValue = -shift;
                                    if (ribMaster[t][a][n - 1].side === 'down') {
                                        shiftValue = -shiftValue + 10;
                                    }
                                    if (angleText > 90 || angleText < -89) {
                                        angleText -= 180;
                                        if (ribMaster[t][a][n - 1].side === 'down') {
                                            shiftValue = -shift;
                                        } else shiftValue = -shiftValue + 10;
                                    }
                                    sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                    let startText = qSVG.middle(ribMaster[t][a][n - 1].coords.x, ribMaster[t][a][n - 1].coords.y, ribMaster[t][a][n].coords.x,
                                        ribMaster[t][a][n].coords.y);
                                    sizeText[n].setAttributeNS(null, 'x', startText.x);
                                    sizeText[n].setAttributeNS(null, 'y', (startText.y) + (shiftValue));
                                    sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
                                    sizeText[n].setAttributeNS(null, 'font-family', 'sans-serif');
                                    sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
                                    sizeText[n].textContent = valueText.toFixed(2);
                                    if (sizeText[n].textContent < 1) {
                                        sizeText[n].setAttributeNS(null, 'font-size', '0.73em');
                                        sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
                                    } else sizeText[n].setAttributeNS(null, 'font-size', '0.9em');
                                    sizeText[n].setAttributeNS(null, 'stroke-width', '0.2px');
                                    sizeText[n].setAttributeNS(null, 'fill', '#555555');
                                    sizeText[n].setAttribute("transform", "rotate(" + angleText + " " + startText.x + "," + (startText.y) + ")");

                                    document.querySelector('#extension-floorplanner-boxRib').append(sizeText[n]);
                                }
                            }
                        }
                    }
                }
            }

            function cursor(tool) {
                if (tool === 'grab') tool =
                    "url('img/add.png') 8 8, auto";
                if (tool === 'scissor') tool = "url('img/scissors.svg'), auto";
                if (tool === 'trash') tool = "url('img/cancel.png'), auto";
                if (tool === 'validation') tool = "url('img/check.svg'), auto";
                linElement.style.cursor = tool;
            }

            function fullscreen() {
                // go full-screen
                let i = document.body;
                if (i.requestFullscreen) {
                    i.requestFullscreen();
                } else if (i.webkitRequestFullscreen) {
                    i.webkitRequestFullscreen();
                } else if (i.mozRequestFullScreen) {
                    i.mozRequestFullScreen();
                } else if (i.msRequestFullscreen) {
                    i.msRequestFullscreen();
                }
            }

            function outFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            document.addEventListener("fullscreenchange", function() {
                if (
                    !document.fullscreenElement &&
                    !document.webkitFullscreenElement &&
                    !document.mozFullScreenElement &&
                    !document.msFullscreenElement) {
                    document.querySelector('#extension-floorplanner-nofull_mode').display = 'none';
                    document.querySelector('#extension-floorplanner-full_mode').style.display = 'block';
                }
            });

            function raz_button() {
                if (document.querySelector('#extension-floorplanner-rect_mode')) {
                    document.querySelector('#extension-floorplanner-rect_mode').classList.remove('extension-floorplanner-btn-success');
                    document.querySelector('#extension-floorplanner-rect_mode').classList.add('extension-floorplanner-btn-default');
                }
                document.querySelector('#extension-floorplanner-select_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-select_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-line_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-line_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-partition_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-partition_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-door_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-door_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-node_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-node_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-text_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-text_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-room_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-room_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-distance_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-distance_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-object_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-object_mode').classList.add('extension-floorplanner-btn-default');
                document.querySelector('#extension-floorplanner-stair_mode').classList.remove('extension-floorplanner-btn-success');
                document.querySelector('#extension-floorplanner-stair_mode').classList.add('extension-floorplanner-btn-default');
            }

            function fonc_button(modesetting, option) {
                //console.error("in fonc_button.  modesetting, option: ", modesetting, option);
                if (modesetting == 'door_mode') {
                    bye_binder();
                }
                //bye_binder();
                if (currently_cloning_an_object == false) {
                    floorplanSave();

                    hide_submenus();
                    raz_button();
                    if (option != 'simpleStair') {
                        document.querySelector('#extension-floorplanner-' + modesetting).classList.remove('extension-floorplanner-btn-default');
                        document.querySelector('#extension-floorplanner-' + modesetting).classList.add('extension-floorplanner-btn-success');
                    }
                }

                mode = modesetting;
                modeOption = option;

                if (document.body.classList.contains('developer')) {
                    document.getElementById('extension-floorplanner-title').innerText = mode;
                }

                if (typeof(lineIntersectionP) != 'undefined') {
                    lineIntersectionP.remove();
                    //delete lineIntersectionP;
                }
            }


            document.querySelector('#extension-floorplanner-distance_mode').addEventListener('click', () => {
                //document.querySelector('#extension-floorplanner-boxMeasure').replaceChildren();
                linElement.style.cursor = 'crosshair';
                document.querySelector("g#extension-floorplanner-boxMeasure").replaceChildren();
                box_info_el.innerHTML = 'Add a measurement';
                fonc_button('distance_mode');
                setTimeout(() => {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                }, 100);
            });

            document.querySelector('#extension-floorplanner-room_mode').addEventListener('click', () => {
                //console.log("clicked on room color button");
                linElement.style.cursor = 'pointer';
                box_info_el.innerHTML = 'Select a room';
                fonc_button('room_mode');
                //console.log("adding do-not-pulsate to root_el");
                setTimeout(() => {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                }, 100);

            });


            document.querySelector('#extension-floorplanner-roomTools').addEventListener('click', () => {
                document.getElementById('extension-floorplanner-tool-root').classList.remove("extension-floorplanner-do-not-pulsate");
            });


            document.querySelector('#extension-floorplanner-select_mode').addEventListener('click', () => {
                do_select_mode();
            });

            function do_select_mode() {
                box_info_el.innerHTML = ''; // Select
                if (typeof(binder) != 'undefined') {
                    bye_binder();
                }
                hideAllSize(); // experiment
                fonc_button('select_mode');
            }

            document.querySelector('#extension-floorplanner-line_mode').addEventListener('click', () => {
                //console.log("floorplanner: clicked on wall button");
                setTimeout(() => {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                }, 100);

                linElement.style.cursor = 'crosshair';
                box_info_el.innerHTML = 'Drag to create walls';
                multi = 0;
                action = 0;
                // snap = calcul_snap(event, grid_snap);
                //
                // pox = snap.x;
                // poy = snap.y;
                fonc_button('line_mode');
            });

            document.querySelector('#extension-floorplanner-partition_mode').addEventListener('click', () => {
                linElement.style.cursor = 'crosshair';
                box_info_el.innerHTML = 'Create thin walls';
                multi = 0;
                fonc_button('partition_mode');
                setTimeout(() => {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                }, 100);
            });

            /*
            if(document.querySelector('#extension-floorplanner-rect_mode')){
                document.querySelector('#extension-floorplanner-rect_mode').addEventListener('click',function () {
                    linElement.style.cursor = 'crosshair';
                    box_info_el.innerHTML = 'Room(s) creation';
                    fonc_button('rect_mode');
                });
            }
            */

            document.querySelectorAll('.extension-floorplanner-door').forEach(function(element) {
                element.addEventListener('click', () => {
                    linElement.style.cursor = 'crosshair';
                    box_info_el.innerHTML = 'Add a door';
                    document.querySelector('#extension-floorplanner-door_list').style.display = 'none';
                    fonc_button('door_mode', element.getAttribute('data-type'));
                });
            });

            document.querySelectorAll('.extension-floorplanner-window').forEach(function(element) {
                element.addEventListener('click', () => {
                    linElement.style.cursor = 'crosshair';
                    box_info_el.innerHTML = 'Add a window';
                    document.querySelector('#extension-floorplanner-door_list').style.display = 'none';
                    document.querySelector('#extension-floorplanner-window_list').style.display = 'none';
                    fonc_button('door_mode', element.id.replace('extension-floorplanner-', ''));
                });
            });

            document.querySelectorAll('.extension-floorplanner-object').forEach(function(element) {
                element.addEventListener('click', () => {
                    cursor('move');
                    box_info_el.innerHTML = 'Add an object';
					bye_binder();
                    fonc_button('object_mode', element.id.replace('extension-floorplanner-', ''));
                    //element.setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox);
                });
            });
            /*
            document.querySelectorAll('.extension-floorplanner-object').forEach(function (element) {
                cursor('move');
                box_info_el.innerHTML = 'Add an object';
                fonc_button('object_mode', element.id.replace('extension-floorplanner-',''));
                    //element.setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox);
                //});
            });
            */
            document.querySelector('#extension-floorplanner-stair_mode').addEventListener('click', () => {
                cursor('move');
                box_info_el.innerHTML = 'Add staircase';
                fonc_button('object_mode', 'simpleStair');
            });

            document.querySelector('#extension-floorplanner-node_mode').addEventListener('click', () => {
                box_info_el
                    .innerHTML = 'Add a joint to a wall<br/><span style=\"font-size:0.7em\">Note: this may remove windows or doors already on that wall.</span>';
                fonc_button('node_mode');
                setTimeout(() => {
                    root_el.classList.add('extension-floorplanner-do-not-pulsate');
                }, 100);
            });

            document.querySelector('#extension-floorplanner-text_mode').addEventListener('click', () => {
                document.getElementById('extension-floorplanner-labelBox').value = '';
                box_info_el.innerHTML = 'Add text<br/><span style=\"font-size:0.7em\">Place the cursor at the desired location</span>';
                fonc_button('text_mode');
            });

            if (document.querySelector('#extension-floorplanner-grid_mode')) {
                document.querySelector('#extension-floorplanner-grid_mode').addEventListener('click', () => {
                    if (grid_snap === 'on') {
                        grid_snap = 'off';
                        box_info_el.innerHTML = 'Help grid off';
                        document.querySelector('#extension-floorplanner-grid_mode').classList.remove('extension-floorplanner-btn-success');
                        document.querySelector('#extension-floorplanner-grid_mode').classList.add('btn-warning');
                        document.querySelector('#extension-floorplanner-grid_mode').innerHTML = 'GRID OFF';
                        document.querySelector('#extension-floorplanner-boxgrid').style.opacity = '0.5';
                    } else {
                        grid_snap = 'on';
                        box_info_el.innerHTML = 'Help grid on';
                        document.querySelector('#extension-floorplanner-grid_mode').classList.remove('btn-warning');
                        document.querySelector('#extension-floorplanner-grid_mode').classList.add('extension-floorplanner-btn-success');
                        document.querySelector('#extension-floorplanner-grid_mode').innerHTML = 'GRID ON';
                        document.querySelector('#extension-floorplanner-boxgrid').style.opacity = '1';
                    }
                });
            }


            //  RETURN PATH(s) ARRAY FOR OBJECT + PROPERTY params => bindBox (false = open sideTool), move, resize, rotate
            // dividerObj is also known as value
            function carpentryCalc(classObj, typeObj, sizeObj, thickObj, dividerObj = 0) {
                //console.log("in carpentryCalc.  classObj, typeObj, sizeObj, thickObj, dividerObj: ", classObj, typeObj, sizeObj, thickObj, dividerObj);
                let construc = [];
                construc.params = {};
                construc.params.bindBox = false;
                construc.params.move = false;
                construc.params.resize = false;
                construc.params.resizeLimit = {};
                construc.params.resizeLimit.width = {
                    min: false,
                    max: false
                };
                construc.params.resizeLimit.height = {
                    min: false,
                    max: false
                };
                construc.params.rotate = false;

                if (classObj === 'socle') {
                    //console.warn("carpentrycalc: mysterious socle spotted.");

                    pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
                        thickObj / 2 + " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) +
                        " Z", "#5cba79", "#5cba79", '');

                }


                if (classObj === 'doorWindow') {
                    if (typeObj === 'simple') {

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "none",
                            '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
                            (-sizeObj - thickObj / 2) + "  A" + sizeObj + "," + sizeObj + " 0 0,1 " + sizeObj / 2 + "," + (-thickObj / 2), "none", colorWall,
                            '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 40,
                            max: 120
                        };
                    }
                    if (typeObj === 'double') {

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "none",
                            '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
                            (-sizeObj / 2 - thickObj / 2) + "  A" + sizeObj / 2 + "," + sizeObj / 2 + " 0 0,1 0," + (-thickObj / 2), "none", colorWall,
                            '');

                        pushToConstruc(construc, "M " + (sizeObj / 2) + "," + (-thickObj / 2) + " L " + (sizeObj / 2) + "," +
                            (-sizeObj / 2 - thickObj / 2) + "  A" + sizeObj / 2 + "," + sizeObj / 2 + " 0 0,0 0," + (-thickObj / 2), "none", colorWall,
                            '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 40,
                            max: 160
                        };
                    }
                    if (typeObj === 'pocket') {
                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-(thickObj / 2) - 4) + " L " + (-sizeObj / 2) + "," +
                            thickObj / 2 + " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-(thickObj / 2) - 4) + " Z", "#ccc",
                            "none",
                            'none');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " M " + (sizeObj / 2) + "," + (thickObj / 2) + " L " + (sizeObj / 2) + "," + (-thickObj / 2), "none", "#494646",
                            '5 5');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
                            (-thickObj / 2 - 5) + " L " + (+sizeObj / 2) + "," + (-thickObj / 2 - 5) + " L " + (+sizeObj / 2) +
                            "," + (-thickObj / 2) + " Z", "url(#hatch)", "#494646", '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 60,
                            max: 200
                        };
                    }
                    if (typeObj === 'aperture') {
                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "#494646",
                            '5,5');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-(thickObj / 2)) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " L " + ((-sizeObj / 2) + 5) + "," + thickObj / 2 + " L " + ((-sizeObj / 2) + 5) + "," + (-(thickObj / 2)) + " Z", "none",
                            "#494646",
                            'none');

                        pushToConstruc(construc, "M " + ((sizeObj / 2) - 5) + "," + (-(thickObj / 2)) + " L " + ((sizeObj / 2) - 5) + "," + thickObj / 2 +
                            " L " + (sizeObj / 2) + "," + thickObj / 2 + " L " + (sizeObj / 2) + "," + (-(thickObj / 2)) + " Z", "none", "#494646",
                            'none');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 40,
                            max: 500
                        };
                    }
                    if (typeObj === 'fix') {
                        pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " +
                            sizeObj / 2 + ",2 L " + sizeObj / 2 + ",-2 Z", "#ccc", "none", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 30,
                            max: 300
                        };
                    }
                    if (typeObj === 'flap') {

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " +
                            sizeObj / 2 + ",2 L " + sizeObj / 2 + ",-2 Z", "#ccc", "none", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((-sizeObj / 2) +
                                ((sizeObj) * 0.866)) + "," + ((-sizeObj / 2) - (thickObj / 2)) + "  A" + sizeObj + "," +
                            sizeObj + " 0 0,1 " + sizeObj / 2 + "," + (-thickObj / 2), "none", colorWall, '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 20,
                            max: 100
                        };
                    }
                    if (typeObj === 'twin') {

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " + sizeObj / 2 +
                            ",2 L " + sizeObj / 2 + ",-2 Z", "#000", "none", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "#fff", "#fff", '', 0.7);

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#000", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((-sizeObj / 2) +
                                ((sizeObj / 2) * 0.866)) + "," + (-sizeObj / 4 - thickObj / 2) + "  A" +
                            sizeObj / 2 + "," + sizeObj / 2 + " 0 0,1 0," + (-thickObj / 2), "none", colorWall, '');

                        pushToConstruc(construc, "M " + (sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((sizeObj / 2) +
                                ((-sizeObj / 2) * 0.866)) + "," + (-sizeObj / 4 - thickObj / 2) + "  A" +
                            sizeObj / 2 + "," + sizeObj / 2 + " 0 0,0 0," + (-thickObj / 2), "none", colorWall, '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 40,
                            max: 200
                        };
                    }
                    if (typeObj === 'bay') {

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
                            " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');

                        pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",0 L 2,0 L 2,2 L 3,2 L 3,-2 Z", "#ccc", "none", '');

                        pushToConstruc(construc, "M -2,1 L -2,3 L " + sizeObj / 2 + ",3 L " + sizeObj / 2 + ",1 L -1,1 L -1,-1 L -2,-1 Z", "#ccc", "none", '');
                        construc.params.resize = true;
                        construc.params.resizeLimit.width = {
                            min: 60,
                            max: 300
                        };
                    }
                }

                if (classObj === 'measure') {
                    //console.log("classObj = measure. sizeObj: ", sizeObj);
                    construc.params.bindBox = true;
                    // 						construc, path, fill, stroke, strokeDashArray, opacity = 1
                    //pushToConstruc(construc, "M-" + (sizeObj / 2) + ",0 l10,-10 l0,8 l" + (sizeObj - 20) + ",0 l0,-8 l10,10 l-10,10 l0,-8 l-" + (sizeObj - 20) + ",0 l0,8 Z", "#729eeb", "none", '');
                    pushToConstruc(construc, "M-" + (sizeObj / 2) + ",0 l10,-10 l0,8 l" + (sizeObj) + ",0 l0,-8 l10,10 l-10,10 l0,-8 l-" + (sizeObj) + ",0 l0,8 Z", "#729eeb", "none", '4 1');
                }

                if (classObj === 'boundingBox') {
                    //console.log("classObj = boundingbox.  sizeObj,thickObj: ", sizeObj, thickObj);
                    /*
                          pushToConstruc(construc,
                          "M" + (-sizeObj / 2 - bounding_padding) + "," + (-thickObj / 2 - bounding_padding) + " L" + (sizeObj / 2 + bounding_padding) + "," + (-thickObj / 2 - bounding_padding) + " L" +
                          (sizeObj / 2 + bounding_padding) + "," + (thickObj / 2 + bounding_padding) + " L" + (-sizeObj / 2 - bounding_padding) + "," + (thickObj / 2 + bounding_padding) + " Z", 'none',
                          "#aaa", '');
                          */
                    pushToConstruc(construc,
                        "M" + (-sizeObj / 2) + "," + (-thickObj / 2) + " L" + (sizeObj / 2) + "," + (-thickObj / 2) + " L" +
                        (sizeObj / 2) + "," + (thickObj / 2) + " L" + (-sizeObj / 2) + "," + (thickObj / 2) + " Z", 'none',
                        "#aaa", '');

                    // construc.push({'path':"M"+dividerObj[0].x+","+dividerObj[0].y+" L"+dividerObj[1].x+","+dividerObj[1].y+" L"+dividerObj[2].x+",
                    // "+dividerObj[2].y+" L"+dividerObj[3].x+","+dividerObj[3].y+" Z", 'fill':'none', 'stroke':"#000", 'strokeDashArray': ''});
                }

                //typeObj = color  dividerObj = text
                if (classObj === 'text' && typeof dividerObj == 'object') {
                    //console.log("recalc: TEXT dividerObj.size: ", dividerObj.size);
                    construc.params.bindBox = true;
                    construc.params.move = true;
                    construc.params.resize = true;
                    construc.params.rotate = true;
                    construc.params.width = 40;
                    construc.params.height = 40;
                    construc.params.resizeLimit = {};
                    construc.params.resizeLimit.width = {
                        min: 20,
                        max: 300
                    };
                    construc.params.resizeLimit.height = {
                        min: 20,
                        max: 300
                    };

                    construc.push({
                        'text': dividerObj.text,
                        'x': '0',
                        'y': Math.round(dividerObj.size / 2.5),
                        'fill': typeObj,
                        'fill-opacity': '.8',
                        'stroke': typeObj,
                        'fontSize': dividerObj.size + 'px',
                        "strokeWidth": "0px",
                        "opacity": '1' // TODO: added
                    });
                }

                if (classObj === 'stair') {
                    construc.params.bindBox = true;
                    construc.params.move = true;
                    construc.params.resize = true;
                    construc.params.rotate = true;
                    construc.params.width = 60;
                    construc.params.height = 180;
                    if (typeObj === 'simpleStair' && typeof dividerObj == 'number' && dividerObj != 0) {
                        pushToConstruc(construc,
                            "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 + " L " + sizeObj / 2 + "," +
                            thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#fff", "#000", '');

                        let heightStep = thickObj / (dividerObj);
                        for (let i = 1; i < dividerObj + 1; i++) {
                            pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + ((-thickObj / 2) + (i * heightStep)) + " L " + (sizeObj / 2) + "," +
                                ((-thickObj / 2) + (i * heightStep)), "none", "#000", 'none');
                        }
                        construc.params.resizeLimit.width = {
                            min: 40,
                            max: 200
                        };
                        construc.params.resizeLimit.height = {
                            min: 40,
                            max: 400
                        };
                    }
                }

                // Added new options via:
                // 1. create and shave svg shape in Pixelmator, placing center of shape in top-left corner (so only a quarter of the shape is visible)
                // 2. copy svg path from svg file in here, and translate to relative svg path: https://svg-path.com/
                // 3. copy relative svg path below

                if (classObj === 'energy') {
                    construc.params.bindBox = true;
                    construc.params.move = true;
                    construc.params.resize = true;
                    construc.params.rotate = true;
                    construc.params.resizeLimit = {};
                    construc.params.resizeLimit.width = {
                        min: 20,
                        max: 300
                    };
                    construc.params.resizeLimit.height = {
                        min: 20,
                        max: 300
                    };

                    /*
			      pushToConstruc(construc,
			          "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 + " L " + sizeObj / 2 + "," +
			          thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#fff", "#000", '');
			                */
                    if (typeObj === 'circle') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "rgba(255,255,255,.1)", "#333", '');
                        construc.params.width = 80;
                        construc.params.height = 80;
                        construc.family = 'free';
                    }

                    if (typeObj === 'half-circle') {
                        pushToConstruc(construc, "m 40 20 L 40 20 C 40 -2.09 22.09 -20 0 -20 C -22.09 -20 -40 -2.09 -40 20 L 40 20 Z", "rgba(255,255,255,.1)", "#333", '');
                        construc.params.width = 80;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'square') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "rgba(255,255,255,.1)", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'crossed-square') {
                        pushToConstruc(construc, "m -18.97 19.51 L -18.97 -18.54 L -18.97 -19.51 L 19 -19.51 L 19 19.51 L 18.05 19.51 Z", "rgba(255,255,255,.1)", "#888", '');
                        pushToConstruc(construc, "m -18.97 19.51 L 18.97 -19.51 L -18.97 -19.51 L 19 19.51 Z", "rgba(255,255,255,.0)", "#888", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'eye') {
                        pushToConstruc(construc, "m 0.35 14.13 C -12.25 14.14 -22.47 1.83 -22.68 1.21 C -23.17 -0.3 -12.63 -11.74 -0.03 -11.76 C 12.58 -11.77 23.18 0.12 23 1.16 C 22.93 1.57 13.39 13.9 1.03 14.12 L 0.35 14.13 Z M 0.67 8.18 C 0.93 8.18 1.19 8.17 1.46 8.14 C 5.69 7.72 8.78 4.03 8.36 -0.12 C 7.93 -4.26 4.16 -7.28 -0.08 -6.88 L -0.15 -6.87 C -4.39 -6.43 -7.46 -2.72 -7.02 1.42 C -6.6 5.3 -3.24 8.19 0.67 8.18 Z", "#f66", "#933", '');
                        construc.params.width = 40;
                        construc.params.height = 20;
                        construc.family = 'free';
                    }

                    if (typeObj === 'heart') {
                        // 						construc, path, fill, stroke, strokeDashArray, opacity = 1
                        pushToConstruc(construc, "m 11.73 2.96 C 10.7 4.85 9.24 6.69 7.35 8.49 C 5.46 10.28 3.22 11.99 0.63 13.62 C 0.47 13.72 0.3 13.81 0.13 13.88 C -0.18 14.04 -0.55 14.04 -0.86 13.88 C -1.03 13.81 -1.2 13.72 -1.36 13.62 C -3.94 11.99 -6.18 10.28 -8.07 8.49 C -9.97 6.69 -11.43 4.85 -12.46 2.96 C -13.49 1.06 -14 -0.91 -14 -2.84 C -14 -4.44 -13.66 -5.8 -12.98 -7.04 C -12.35 -8.24 -11.4 -9.24 -10.24 -9.95 C -9.08 -10.65 -7.75 -11.02 -6.39 -11 C -5.04 -11 -3.82 -10.66 -2.81 -9.98 C -1.79 -9.31 -0.95 -8.4 -0.36 -7.34 C 0.22 -8.4 1.06 -9.31 2.08 -9.98 C 3.1 -10.66 4.32 -11 5.66 -11 C 7.02 -11.02 8.36 -10.65 9.51 -9.95 C 10.67 -9.24 11.62 -8.24 12.26 -7.04 C 12.93 -5.8 13.27 -4.44 13.27 -2.84 C 13.27 -0.91 12.76 1.06 11.73 2.96 Z", "#f00", "#333", '');
                        construc.params.width = 50;
                        construc.params.height = 50;
                        construc.family = 'free';
                    }

                    if (typeObj === 'droplet') {
                        pushToConstruc(construc, "m 2 13a5 5 0 0 0 10 0c0-1.73-1.66-5.03-5-9.65C3.66 7.97 2 11.27 2 13zM7 0c4.67 6.09 7 10.42 7 13a7 7 0 0 1-14 0c0-2.58 2.33-6.91 7-13z", "#44f", "#333", '');
                        construc.params.width = 20;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'triangle') {
                        pushToConstruc(construc, "m 0 -16.5 L -18 15 L 18 15 Z", "#fff", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'dome') {
                        pushToConstruc(construc, "m 20 0 L 20 0 C 20 -11.05 11.05 -20 0 -20 C -11.05 -20 -20 -11.05 -20 0 L -20 20 L 20 20 L 20 0 Z", "", "#333", '');
                        construc.params.width = 50;
                        construc.params.height = 50;
                        construc.family = 'free';
                    }

                    if (typeObj === 'flower') {
                        let random_color = getRandomColor();
                        //console.log("random color: ", random_color);
                        pushToConstruc(construc, "m 4.1 -9.9 C 9.13 -22.03 -9.13 -22.03 -4.1 -9.9 C -9.13 -22.03 -22.03 -9.13 -9.9 -4.1 C -22.03 -9.13 -22.03 9.13 -9.9 4.1 C -22.03 9.13 -9.13 22.03 -4.1 9.9 C -9.13 22.03 9.13 22.03 4.1 9.9 C 9.13 22.03 22.03 9.13 9.9 4.1 C 22.03 9.13 22.03 -9.13 9.9 -4.1 C 22.03 -9.13 9.12 -22.03 4.1 -9.9 Z", random_color, "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'leaf') {
                        pushToConstruc(construc, "m19-40s2 6 5 14c3 8.4 5.7 12.220772.3 18-4.3 4.9-17 10-18 13-1 3.067901.6 7 4.6 5 3.8-2 16-17 17-18 0 0 1.2 6 1 10 0 3-.3 10-2 11.8-1.4 1.2-9.6 5.7-17 6.5-4.704797.6-9.8 2.5-6.2 5 4.4 3 17-5 22.6-5.9 0 0-.3 5-1 7.1-1.2 3.9-5 12.4-14 12.4-6 0-10-3-10-5-.1-2-3.2-2-3.4-.3-.2 1.4-2.2 5.3-9.3 5.3-7 0-19-7-20-14-1-7.117516.9-7.44186.9-7.5s13.4 10 23 10c9.3 0-1.3-4.8-4.6-6.2-3.4-1.3-17.4-7.7-17.4-11.8 0-4.2-.755966-10 9-18.6 0 0 6.2 14.5 9.6 18.6 3.4 4.1 9.8 4.8 9.302326.3-.5-4.3-16.4-21.2-13.6-25.7 3.1-5.2 9.4-12 14.6-13 0 0 .0 9.0093.9 14s4.4 9.3 6.8 5.9c2.6-3.7-4-15.5-4-18 0-2.4 7.1-13.6 15.8-13.6z", "#8f8", "#333", '');
                        construc.params.width = 30;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'star') {
                        pushToConstruc(construc, "m 0.5 -11 L -3.42 -4.18 L -11.39 -2.71 L -5.85 2.98 L -6.85 10.71 L 0.5 7.41 L 7.85 10.71 L 6.85 2.98 L 12.39 -2.71 L 4.42 -4.18 Z", "#ff0", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'rounded-square') {
                        pushToConstruc(construc, "m -18 11 C -18 15.97 -13.97 20 -9 20 L 11 20 C 15.97 20 20 15.97 20 11 L 20 -9 C 20 -13.97 15.97 -18 11 -18 L -9 -18 C -13.97 -18 -18 -13.97 -18 -9 Z", "rgba(255,255,255,.8)", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'paw') {
                        pushToConstruc(construc, "m 9.87 19 C 6.63 19 5.72 17.22 0 17.22 C -5.72 17.22 -6.63 19 -9.87 19 C -14.29 19 -15.02 15.3 -15.02 13.38 C -15.02 10.12 -12.62 8.11 -8.84 5.24 C -5.15 2.43 -5.03 -1.42 0 -1.42 C 5.03 -1.42 5.15 2.43 8.84 5.24 C 12.62 8.11 15.02 10.12 15.02 13.38 C 15.02 15.3 14.29 19 9.87 19 Z M -6.68 -17.98 C -4.08 -18.3 -1.47 -14.37 -0.97 -10.3 C -0.47 -6.22 -2.28 -3.55 -4.87 -3.23 C -7.47 -2.91 -9.87 -5.07 -10.37 -9.14 C -10.87 -13.21 -9.27 -17.66 -6.68 -17.98 Z M -16.51 -9.31 C -14.17 -10.03 -11.11 -6.83 -9.99 -3.14 C -8.87 0.54 -10.11 3.31 -12.45 4.04 C -14.8 4.76 -17.37 3.15 -18.49 -0.53 C -19.61 -4.22 -18.86 -8.59 -16.51 -9.31 Z M 6.68 -17.98 C 4.08 -18.3 1.47 -14.37 0.97 -10.3 C 0.47 -6.22 2.28 -3.55 4.87 -3.23 C 7.47 -2.91 9.87 -5.07 10.37 -9.14 C 10.87 -13.21 9.27 -17.66 6.68 -17.98 Z M 16.51 -9.31 C 14.17 -10.03 11.11 -6.83 9.99 -3.14 C 8.87 0.54 10.11 3.31 12.46 4.04 C 14.8 4.76 17.37 3.15 18.49 -0.53 C 19.61 -4.22 18.86 -8.59 16.51 -9.31 Z", "#aaf", "#aaf", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    // 17.85 28.54
                    if (typeObj === 'note') {
                        pushToConstruc(construc, "m 8.85 8.54 C 10.55 6.59 11.47 3.73 11.47 0.59 C 11.47 -5.7 3.62 -8.84 3.62 -8.84 L 3.62 12.96 L 3.62 12.96 C 3.62 14.91 2.1 17.06 -0.35 18.22 C -1.38 18.72 -2.5 18.98 -3.64 19 C -5.49 19 -7.06 18.24 -7.7 16.83 C -7.9 16.4 -8 15.94 -8 15.47 C -8 13.52 -6.47 11.37 -4.03 10.21 C -3 9.71 -1.88 9.44 -0.74 9.43 C 0.53 9.42 1.66 9.79 2.46 10.47 L 2.46 -19 L 3.62 -19 C 3.62 -14.2 6.82 -12.24 9.58 -8.4 C 11.26 -6.05 12.63 -3.42 12.63 -0.29 C 12.63 3.24 11.24 6.33 8.85 8.54 Z", "#333", "#333", '');
                        construc.params.width = 30;
                        construc.params.height = 60;
                        construc.family = 'free';
                    }

                    if (typeObj === 'wifi') {
                        pushToConstruc(construc, "m 16.66 -6.5 C 16.49 -6.33 16.26 -6.23 16.02 -6.23 C 15.78 -6.24 15.56 -6.34 15.39 -6.51 C 11.4 -10.81 5.83 -13.25 0 -13.25 C -5.83 -13.25 -11.4 -10.81 -15.39 -6.51 C -15.56 -6.34 -15.78 -6.24 -16.02 -6.23 C -16.26 -6.23 -16.49 -6.33 -16.66 -6.5 L -18.74 -8.6 C -19.08 -8.93 -19.09 -9.49 -18.76 -9.84 C -13.88 -15.05 -7.1 -18 0 -18 C 7.1 -18 13.88 -15.05 18.76 -9.84 C 19.09 -9.49 19.08 -8.94 18.74 -8.6 Z M 0 -8.47 C 4.63 -8.47 9.04 -6.49 12.14 -3.02 C 12.46 -2.66 12.45 -2.11 12.11 -1.77 L 10.02 0.35 C 9.84 0.53 9.61 0.62 9.36 0.62 C 9.12 0.61 8.88 0.5 8.72 0.31 C 6.52 -2.24 3.34 -3.7 0 -3.7 C -3.34 -3.7 -6.52 -2.24 -8.72 0.31 C -8.88 0.5 -9.11 0.61 -9.36 0.62 C -9.61 0.62 -9.84 0.53 -10.02 0.35 L -12.11 -1.77 C -12.45 -2.11 -12.46 -2.66 -12.13 -3.02 C -9.03 -6.49 -4.62 -8.47 0 -8.47 Z M 0 1.07 C 2.16 1.06 4.2 2.05 5.55 3.75 C 5.83 4.1 5.8 4.62 5.48 4.94 L 0.64 9.74 C 0.28 10.09 -0.28 10.09 -0.64 9.74 L -5.48 4.94 C -5.8 4.62 -5.83 4.1 -5.55 3.75 C -4.2 2.05 -2.15 1.06 0 1.07 Z", "#00f", "#00f", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'bed') {
                        pushToConstruc(construc, "m 10 10 L -10 10 L -10 20 L 10 20 Z", "#ccc", "none", '');
                        pushToConstruc(construc, "m 10 -20 L -10 -20 L -10 10 L 10 10 Z", "#aaa", "none", '');
                        pushToConstruc(construc, "m 7 14.5 C 7 13.12 5.88 12 4.5 12 L -4.5 12 C -5.88 12 -7 13.12 -7 14.5 C -7 15.88 -5.88 17 -4.5 17 L 4.5 17 C 5.88 17 7 15.88 7 14.5 Z", "#999", "#ccc", '');
                        construc.params.width = 120;
                        construc.params.height = 160;
                        construc.family = 'free';
                    }

                    if (typeObj === 'double-bed') {

                        //pushToConstruc(construc, "m 100 50 L -100 50 L -100 100 L 100 100 Z", "#fff", "#333", '');
                        //pushToConstruc(construc, "m 100 -100 L -100 -100 L -100 50 L 100 50 Z", "#ccc", "#333", '');
                        //pushToConstruc(construc, "m 80 72.5 C 80 65.6 74.4 60 67.5 60 L 22.5 60 C 15.6 60 10 65.6 10 72.5 C 10 79.4 15.6 85 22.5 85 L 67.5 85 C 74.4 85 80 79.4 80 72.5 Z", "#ccc", "#333", '');

                        pushToConstruc(construc, "m 20 10 L -20 10 L -20 20 L 20 20 Z", "#ccc", "none", '');
                        pushToConstruc(construc, "m 20 -20 L -20 -20 L -20 10 L 20 10 Z", "#aaa", "none", '');
                        pushToConstruc(construc, "m 16 14.5 C 16 13.12 14.88 12 13.5 12 L 4.5 12 C 3.12 12 2 13.12 2 14.5 C 2 15.88 3.12 17 4.5 17 L 13.5 17 C 14.88 17 16 15.88 16 14.5 Z M -3 14.5 C -3 13.12 -4.12 12 -5.5 12 L -14.5 12 C -15.88 12 -17 13.12 -17 14.5 C -17 15.88 -15.88 17 -14.5 17 L -5.5 17 C -4.12 17 -3 15.88 -3 14.5 Z", "#aaa", "none", '');
                        construc.params.width = 200;
                        construc.params.height = 200;
                        construc.family = 'free';
                    }

                    if (typeObj === 'closet') {
                        pushToConstruc(construc, "m -3 37 L -53 26 M 2 37 L 47 26 M -53 26 L 47 26 L 47 -24 L -53 -24 Z", "#ccc", "#333", '');
                        construc.params.width = 80;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'couch') {
                        pushToConstruc(construc, "m 25.97 17 L -19.49 17 C -24.32 17 -28.28 13.04 -28.28 8.21 L -28.28 -8.14 C -28.28 -12.98 -24.32 -16.93 -19.49 -16.93 L 25.97 -16.93 C 30.81 -16.93 34.76 -12.98 34.76 -8.14 L 34.76 8.21 C 34.76 13.04 30.81 17 25.97 17", "#fff", "#333", '');
                        pushToConstruc(construc, "m 36.87 6.88 L 34.22 6.88 C 32.55 6.88 31.18 5.52 31.18 3.85 L 31.18 -13.9 C 31.18 -15.57 32.55 -16.93 34.22 -16.93 L 36.87 -16.93 C 38.54 -16.93 39.9 -15.57 39.9 -13.9 L 39.9 3.85 C 39.9 5.52 38.54 6.88 36.87 6.88 M -27.73 6.88 L -30.38 6.88 C -32.05 6.88 -33.42 5.52 -33.42 3.85 L -33.42 -13.9 C -33.42 -15.57 -32.05 -16.93 -30.38 -16.93 L -27.73 -16.93 C -26.07 -16.93 -24.7 -15.57 -24.7 -13.9 L -24.7 3.85 C -24.7 5.52 -26.07 6.88 -27.73 6.88", "#ccc", "#333", '');
                        pushToConstruc(construc, "m 31.73 17 L -25.24 17 C -28.88 17 -31.86 14.02 -31.86 10.38 L -31.86 10.38 C -31.86 6.75 -28.88 3.77 -25.24 3.77 L 31.73 3.77 C 35.37 3.77 38.34 6.75 38.34 10.38 L 38.34 10.38 C 38.34 14.02 35.37 17 31.73 17", "#fff", "#333", '');
                        construc.params.width = 130;
                        construc.params.height = 80;
                        construc.family = 'free';
                    }

                    if (typeObj === 'sofa-seat') {
                        pushToConstruc(construc, "m 11.78 19 L -10.06 19 C -12.38 19 -14.28 15.04 -14.28 10.21 L -14.28 -6.14 C -14.28 -10.98 -12.38 -14.93 -10.06 -14.93 L 11.78 -14.93 C 14.1 -14.93 16 -10.98 16 -6.14 L 16 10.21 C 16 15.04 14.1 19 11.78 19", "#fff", "#333", '');
                        pushToConstruc(construc, "m -20 6 C -20 8.76 -17.76 11 -15 11 C -12.24 11 -10 8.76 -10 6 L -10 -10 C -10 -12.76 -12.24 -15 -15 -15 C -17.76 -15 -20 -12.76 -20 -10 Z M 11 6 C 11 8.76 13.24 11 16 11 C 18.76 11 21 8.76 21 6 L 21 -10 C 21 -12.76 18.76 -15 16 -15 C 13.24 -15 11 -12.76 11 -10 Z", "#ccc", "#333", '');
                        pushToConstruc(construc, "m 15.53 19 L -14.39 19 C -16.3 19 -17.86 16.02 -17.86 12.38 L -17.86 12.38 C -17.86 8.75 -16.3 5.77 -14.39 5.77 L 15.53 5.77 C 17.44 5.77 19 8.75 19 12.38 L 19 12.38 C 19 16.02 17.44 19 15.53 19", "#fff", "#333", '');
                        construc.params.width = 75;
                        construc.params.height = 75;
                        construc.family = 'free';
                    }



                    if (typeObj === 'tv') {
                        pushToConstruc(construc, "m-25.972872-4.574562h51.567162l5.769916 11.19516h-63.106718z", "#fff", "#333", '');
                        pushToConstruc(construc, "m-25.285498-4.071335-5.112459 10.054611h60.41761l-5.112734-10.054611z", "#ccc", "#333", '');
                        pushToConstruc(construc, "m-30.660994 8h61.31688l.70832-1.379402h-63.106718z", "#ccc", "#333", '');
                        construc.params.width = 100;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'sink') {
                        //pushToConstruc(construc, "m160 49.5c0-70.968597-57.531403-128.5-128.5-128.5-70.96859 0-128.5 57.531403-128.5 128.5 0 70.96859 57.53141 128.5 128.5 128.5 70.968597 0 128.5-57.53141 128.5-128.5z", "#fff", "#333", '');
                        pushToConstruc(construc, "m-9 34c-.552282 0-1-.447716-1-1s.447718-1 1-1 1 .447716 1 1-.447718 1-1 1zm17 0c-.552283 0-1-.447716-1-1s.447717-1 1-1c.552282 0 1 .447716 1 1s-.447718 1-1 1zm-8.5-10c-15.187801 0-27.5-12.312195-27.5-27.5s12.312199-27.5 27.5-27.5 27.5 12.312195 27.5 27.5c0 15.020439-12.043373 27.22496-27 27.492188-.166652.002979-.332637.007812-.5.007812z", "#fff", "#333", '');
                        pushToConstruc(construc, "m-2 34c0 1.104568.895431 2 2 2s2-.895432 2-2v-26c0-1.104568-.895431-2-2-2s-2 .895432-2 2z", "#fff", "#333", '');
                        construc.params.width = 25;
                        construc.params.height = 50;
                        construc.family = 'free';
                    }

                    if (typeObj === 'stove') {
                        //pushToConstruc(construc, "m160 49.5c0-70.968597-57.531403-128.5-128.5-128.5-70.96859 0-128.5 57.531403-128.5 128.5 0 70.96859 57.53141 128.5 128.5 128.5 70.968597 0 128.5-57.53141 128.5-128.5z", "#fff", "#333", '');
                        pushToConstruc(construc, "m -30 30 L -30 -30 L 30 -30 L 30 30 L -30 30 Z M -12.38 20.25 C -8.44 20.25 -5.25 17.06 -5.25 13.13 C -5.25 9.19 -8.44 6 -12.38 6 C -16.31 6 -19.5 9.19 -19.5 13.13 C -19.5 17.06 -16.31 20.25 -12.38 20.25 Z M 12.38 20.25 C 16.31 20.25 19.5 17.06 19.5 13.13 C 19.5 9.19 16.31 6 12.38 6 C 8.44 6 5.25 9.19 5.25 13.13 C 5.25 17.06 8.44 20.25 12.38 20.25 Z M -12.38 -4.5 C -8.44 -4.5 -5.25 -7.69 -5.25 -11.63 C -5.25 -15.56 -8.44 -18.75 -12.38 -18.75 C -16.31 -18.75 -19.5 -15.56 -19.5 -11.63 C -19.5 -7.69 -16.31 -4.5 -12.38 -4.5 Z M 12.38 -4.5 C 16.31 -4.5 19.5 -7.69 19.5 -11.63 C 19.5 -15.56 16.31 -18.75 12.38 -18.75 C 8.44 -18.75 5.25 -15.56 5.25 -11.63 C 5.25 -7.69 8.44 -4.5 12.38 -4.5 Z", "#eee", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }


                    if (typeObj === 'standing-lamp') {
                        pushToConstruc(construc, "m 0 36 C -19.88 36 -36 19.88 -36 0 C -36 -19.88 -19.88 -36 0 -36 C 19.88 -36 36 -19.88 36 0 C 36 19.88 19.88 36 0 36 Z M 0 19 C 10.49 19 19 10.49 19 0 C 19 -10.49 10.49 -19 0 -19 C -10.49 -19 -19 -10.49 -19 0 C -19 10.49 -10.49 19 0 19 Z M 0 -19 L 1 -1 L 16 9.23 L 0 1 L -16 9.23 L -1 -1 L 0 -19 Z", "#bbb", "#ddd", '');
                        //pushToConstruc(construc, "m 6 0 C 6 -3.31 3.31 -6 0 -6 C -3.31 -6 -6 -3.31 -6 0 C -6 3.31 -3.31 6 0 6 C 3.31 6 6 3.31 6 0 Z", "#FFFC67", "$FFF", '');
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 12), "#FFFC67", "#FFFC67", '');
                        construc.params.width = 25;
                        construc.params.height = 25;
                        construc.family = 'free';
                    }



                    if (typeObj === 'toilet') {
                        //pushToConstruc(construc, "m160 49.5c0-70.968597-57.531403-128.5-128.5-128.5-70.96859 0-128.5 57.531403-128.5 128.5 0 70.96859 57.53141 128.5 128.5 128.5 70.968597 0 128.5-57.53141 128.5-128.5z", "#fff", "#333", '');
                        pushToConstruc(construc, "m -20 -8.5 C -20 5.58 -11.49 17 -1 17 C 9.49 17 18 5.58 18 -8.5 C 18 -22.58 9.49 -34 -1 -34 C -11.49 -34 -20 -22.58 -20 -8.5 Z", "#fff", "#333", '');
                        pushToConstruc(construc, "m 20 18 C 20 15.79 18.21 14 16 14 L -18 14 C -20.21 14 -22 15.79 -22 18 L -22 29 C -22 31.21 -20.21 33 -18 33 L 16 33 C 18.21 33 20 31.21 20 29 Z", "#fff", "#333", '');
                        construc.params.width = 32;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'shower') {
                        //pushToConstruc(construc, "m160 49.5c0-70.968597-57.531403-128.5-128.5-128.5-70.96859 0-128.5 57.531403-128.5 128.5 0 70.96859 57.53141 128.5 128.5 128.5 70.968597 0 128.5-57.53141 128.5-128.5z", "#fff", "#333", '');
                        pushToConstruc(construc, "m -0.31 15.15 C -1.87 15.16 -3.3 14.13 -3.73 12.55 C -4.23 10.69 -3.12 8.77 -1.25 8.27 C 0.62 7.77 2.53 8.87 3.04 10.74 L 6.15 15.15 L 0.56 15.03 C 0.27 15.11 -0.02 15.14 -0.31 15.15 Z M -11.78 11.45 C -12.7 11.41 -13.52 10.79 -13.77 9.85 C -14.08 8.71 -13.4 7.53 -12.25 7.22 C -11.1 6.91 -9.92 7.59 -9.62 8.74 L -9.06 10.82 L -11.14 11.38 C -11.35 11.43 -11.57 11.46 -11.78 11.45 Z M 9.53 10.44 L -15.93 -16.44 L 10.94 9.02 L 9.53 10.44 Z M 14.15 8.15 L 10.08 3.91 C 8.41 2.94 7.83 0.8 8.8 -0.87 C 9.77 -2.55 11.91 -3.12 13.58 -2.15 C 15.25 -1.19 15.83 0.95 14.86 2.63 L 14.15 8.15 Z M -5.21 4.55 C -5.94 4.52 -6.59 4.03 -6.79 3.29 C -7.03 2.38 -6.49 1.45 -5.58 1.2 C -4.68 0.96 -3.74 1.5 -3.5 2.41 L -3.06 4.05 L -4.7 4.49 C -4.87 4.54 -5.04 4.56 -5.21 4.55 Z M 6.25 -5.87 L 4.39 -6.94 C 3.36 -7.54 3.01 -8.85 3.6 -9.88 C 4.2 -10.91 5.51 -11.26 6.54 -10.67 C 7.57 -10.08 7.92 -8.76 7.33 -7.73 L 6.25 -5.87 Z M 15.28 -6.41 L 13.81 -7.26 C 12.99 -7.73 12.72 -8.77 13.19 -9.59 C 13.66 -10.4 14.7 -10.68 15.51 -10.21 C 16.32 -9.74 16.6 -8.7 16.13 -7.88 L 15.28 -6.41 Z M 19.52 -29 L 18.5 8 L 20.5 8 Z M -32 21.48 L 5 22.5 L 5 20.5 Z", "#47aae7", "#47aae7", '');
                        pushToConstruc(construc, "m 9.15 21.65 C 9.15 27.45 13.86 32.15 19.65 32.15 C 25.45 32.15 30.15 27.45 30.15 21.65 C 30.15 15.85 25.45 11.15 19.65 11.15 C 13.86 11.15 9.15 15.85 9.15 21.65 Z", "#ccc", "#aaa", '');
                        construc.params.width = 40;
                        construc.params.height = 50;
                        construc.family = 'free';
                    }



                    if (typeObj === 'lock') {
                        pushToConstruc(construc, "m 10.31 20 L -10.88 20 C -12.6 20 -14 18.61 -14 16.9 L -14 -0.16 C -14 -1.87 -12.6 -3.26 -10.88 -3.26 L -10.73 -3.26 L -10.73 -9.61 C -10.73 -15.35 -6.05 -20 -0.29 -20 C 5.48 -20 10.16 -15.35 10.16 -9.61 L 10.16 -3.26 L 10.31 -3.26 C 12.03 -3.26 13.43 -1.87 13.43 -0.16 L 13.43 16.9 C 13.43 18.61 12.03 20 10.31 20 Z M 7.04 -9.61 C 7.04 -13.64 3.76 -16.9 -0.29 -16.9 C -4.33 -16.9 -7.61 -13.64 -7.61 -9.61 L -7.61 -3.26 L 7.04 -3.26 L 7.04 -9.61 Z", "#990", "#333", '');
                        construc.params.width = 25;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'pill') {
                        pushToConstruc(construc, "m -10.077519 10 C -15.557549 10 -20 5.522842 -20 0 C -20 -5.522842 -15.557549 -10 -10.077519 -10 L 10.077518 -10 C 15.557549 -10 20 -5.522842 20 0 C 20 5.522842 15.557549 10 10.077518 10 L -10.077519 10 Z", "#fff", "#333", '');
                        construc.params.width = 30;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }


                    if (typeObj === 'mouse-cursor') {
                        pushToConstruc(construc, "m 400 681 L 522 632 L 430 404 L 580 407 L 209 35 L 201 560 L 307 454 Z", "#fff", "#333", '');
                        construc.params.width = 70;
                        construc.params.height = 70;
                        construc.family = 'free';
                    }

                    if (typeObj === 'stairs-corner') {
                        
						//pushToConstruc(construc, "m 73.87 -75.13 C 62.27 -75.13 50.98 -73.82 40.14 -71.33 C 28.81 -68.72 17.98 -64.84 7.8 -59.84 C -7.12 -52.51 -20.64 -42.78 -32.26 -31.14 C -43.58 -19.81 -53.1 -6.67 -60.34 7.8 C -65.59 18.28 -69.64 29.46 -72.33 41.16 C -74.82 51.99 -76.13 63.28 -76.13 74.87 L 73.87 74.87 L 73.87 -75.13 Z", "rgba(255,255,255,.7)", "#333", '');
						pushToConstruc(construc, "m 19.7 -20.04 C 16.6 -20.04 13.59 -19.68 10.7 -19.02 C 7.68 -18.33 4.79 -17.29 2.08 -15.96 C -1.9 -14 -5.5 -11.41 -8.6 -8.31 C -11.62 -5.28 -14.16 -1.78 -16.09 2.08 C -17.49 4.87 -18.57 7.85 -19.29 10.98 C -19.95 13.86 -20.3 16.87 -20.3 19.96 L 19.7 19.96 L 19.7 -20.04 Z", "rgba(255,255,255,.9)", "#333", '');
						pushToConstruc(construc, "m -8.57 -8.04 L 19.7 19.96", "none", "#333", '');
						pushToConstruc(construc, "m 0.5 -15.24 L 19.7 19.96", "none", "#333", '');
						pushToConstruc(construc, "m -14.7 -0.04 L 19.7 19.96", "none", "#333", '');
						pushToConstruc(construc, "m -18.7 9.56 L 19.7 19.96", "none", "#333", '');
						pushToConstruc(construc, "m 11.16 -18.7 L 19.7 19.96", "none", "#333", '');
						
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }
					




                    if (typeObj === 'car') {
                        //pushToConstruc(construc, "m -31.47 250.32 C -63.88 250.2 -96.24 243.96 -107.4 193.71 C -108.88 162.16 -109.25 136.92 -107.4 102.41 C -106 99.78 -104.6 97.17 -103.2 94.54 C -104.89 33.9 -106.95 -25.63 -103.82 -89.61 C -105.67 -94.69 -107.53 -99.76 -109.38 -104.82 C -116.18 -235.92 -90.35 -244.21 -1.87 -248.78 L -1.87 -248.78 C 55.93 -246.76 87.99 -240.94 101 -202.3 C 101.45 -201.49 101.89 -200.66 102.31 -199.81 C 101.61 -202.54 100.91 -205.28 100.09 -208 C 109.14 -186.2 110.94 -152.63 107.03 -100.64 C 106.78 -100.06 106.53 -99.48 106.28 -98.9 C 104.78 -95.85 103.63 -92.63 102.05 -89.62 C 102.14 -88.4 102.22 -87.17 102.31 -85.95 C 102.35 -85.94 102.38 -85.93 102.42 -85.92 C 104.24 -25.75 105.94 34.76 102.31 94.55 C 108.33 101.13 105.46 109.94 107.03 117.63 C 109.6 137.45 110.7 165.44 108.08 192.67 C 106.29 217.72 94.56 231.57 78.84 239.27 C 56.07 250.96 24.45 249.21 2.71 249.85 C -8.02 249.61 -19.75 250.37 -31.47 250.32 Z", "#f44", "#333", '');
                        //pushToConstruc(construc, "m -2.93 244.87 C -13.45 244.84 -23.85 244.47 -33.91 243.92 C -32.8 241.2 -31.87 238.66 -31.69 235.75 C -7.59 236.74 16.88 236.62 39.5 234.27 C 39.93 237.73 40.92 240.45 42.46 242.43 C 28.25 244.17 13.62 244.85 -0.82 244.87 C -1.52 244.87 -2.23 244.88 -2.93 244.87 Z M -68.2 237.08 C -74.75 234.86 -90.94 225.21 -87.85 215.94 C -83.52 212.6 -61.03 221.87 -58.19 227.07 C -57.82 232.63 -62.64 237.08 -68.2 237.08 Z M 73.61 236.12 C 68.04 236.12 63.23 231.67 63.6 226.11 C 66.44 220.91 88.93 211.63 93.26 214.97 C 96.35 224.25 80.16 233.9 73.61 236.12 Z M 1.03 208.92 C -23.59 208.92 -48.02 201.84 -69.69 188.46 C -70.04 163.8 -70.38 139.14 -70.73 114.48 L -70.73 114.48 C -19.7 119.9 27.66 123.22 72.93 111.86 L 72.93 186.89 C 50.47 201.84 25.65 208.92 1.03 208.92 Z M -88.56 148.06 C -90.66 135.12 -92.23 121.65 -94.33 108.71 C -96.95 35.42 -98 -34.71 -93.28 -110.62 C -88.21 -78.35 -83.93 -48.71 -81.22 -14.6 C -78.16 48.8 -82.18 116.14 -88.56 148.06 Z M 91.23 142.13 C 84.84 110.21 80.83 42.87 83.89 -20.53 C 86.6 -54.63 90.88 -84.28 95.95 -116.55 C 100.66 -40.64 99.62 29.49 97 102.77 C 94.89 115.72 93.32 129.19 91.23 142.13 Z M -77.54 -52.38 C -80.69 -77.91 -83.84 -103.45 -86.99 -128.98 C -86.96 -129.02 -86.93 -129.05 -86.9 -129.08 L -87.25 -129.08 C -84.1 -199.63 -54.22 -232.98 0.05 -236.56 C 67.51 -234.54 83.6 -191.46 87.61 -128.8 L 87.34 -128.8 C 87.43 -128.68 87.52 -128.57 87.61 -128.46 C 84.81 -103.97 82.02 -79.49 79.23 -55 C 41.13 -63.57 -19 -72.67 -77.54 -52.38 Z M -87.5 -197.47 C -90.36 -197.42 -92.24 -199.74 -92.99 -205.25 C -92.64 -211.77 -78.78 -223.6 -76.14 -224.52 C -63.08 -222.41 -64.62 -215.44 -76.06 -203.99 C -80.77 -199.97 -84.63 -197.53 -87.5 -197.47 Z M 90.88 -197.96 C 88.04 -197.92 84.09 -200.02 79.22 -203.54 C 66.9 -214.03 64.8 -220.86 77.65 -224 C 80.36 -223.3 95.13 -212.64 96 -206.16 C 95.69 -200.44 93.91 -197.99 90.88 -197.96 Z", "#000", "#333", '');
                        pushToConstruc(construc, "m -4.92 42.05 C -10.46 42.08 -16.07 41.17 -17.97 32.54 C -18.22 27.24 -18.28 23 -17.97 17.21 C -17.74 16.76 -17.51 16.32 -17.27 15.88 C -17.56 5.69 -17.9 -4.31 -17.38 -15.05 C -17.69 -15.91 -18 -16.76 -18.31 -17.61 C -19.44 -39.64 -15.12 -41.03 -0.31 -41.79 C 9.36 -41.45 14.73 -40.48 16.91 -33.98 C 16.98 -33.84 17.05 -33.71 17.12 -33.57 C 17.01 -34.03 16.89 -34.49 16.75 -34.95 C 18.27 -31.28 18.57 -25.64 17.91 -16.91 C 17.87 -16.81 17.83 -16.71 17.79 -16.62 C 17.54 -16.1 17.34 -15.56 17.08 -15.06 C 17.09 -14.85 17.11 -14.65 17.12 -14.44 C 17.13 -14.44 17.14 -14.44 17.14 -14.44 C 17.45 -4.33 17.73 5.84 17.12 15.88 C 18.13 16.99 17.65 18.47 17.91 19.76 C 18.34 23.09 18.53 27.79 18.09 32.37 C 17.8 36.48 15.92 38.79 13.38 40.1 C 13.34 40.12 13.3 40.15 13.25 40.17 C 13.24 40.17 13.23 40.18 13.21 40.19 C 9.4 42.16 4.1 41.87 0.45 41.97 C -1.24 41.94 -3.08 42.05 -4.92 42.05 Z", "#f44", "#f44", '');
                        pushToConstruc(construc, "m -0.14 41.14 C -2.02 41.14 -3.88 41.08 -5.68 40.98 C -5.49 40.52 -5.33 40.09 -5.3 39.61 C -1.27 39.77 2.82 39.75 6.61 39.36 C 6.68 39.94 6.85 40.4 7.11 40.73 C 4.73 41.02 2.28 41.13 -0.14 41.14 Z M -11.41 39.83 C -12.51 39.46 -15.22 37.84 -14.7 36.28 C -13.98 35.72 -10.21 37.27 -9.74 38.15 C -9.68 39.08 -10.48 39.83 -11.41 39.83 Z M 12.32 39.67 C 11.39 39.67 10.58 38.92 10.64 37.99 C 11.12 37.11 14.88 35.55 15.61 36.12 C 16.12 37.67 13.41 39.29 12.32 39.67 Z M 0.17 35.1 C -3.95 35.1 -8.04 33.91 -11.66 31.66 C -11.72 27.52 -11.78 23.38 -11.84 19.23 C -3.3 20.14 4.63 20.7 12.21 18.79 L 12.21 31.4 C 8.45 33.91 4.29 35.1 0.17 35.1 Z M -14.82 24.87 C -15.17 22.7 -15.44 20.44 -15.79 18.26 C -16.23 5.95 -16.4 -5.83 -15.61 -18.58 C -14.76 -13.16 -14.05 -8.18 -13.59 -2.45 C -13.08 8.2 -13.75 19.51 -14.82 24.87 Z M 15.27 23.88 C 14.2 18.51 13.53 7.2 14.04 -3.45 C 14.49 -9.18 15.21 -14.16 16.06 -19.58 C 16.85 -6.83 16.67 4.95 16.23 17.27 C 15.88 19.44 15.62 21.7 15.27 23.88 Z M -12.98 -8.8 C -13.51 -13.09 -14.03 -17.38 -14.56 -21.67 C -14.55 -21.68 -14.55 -21.68 -14.54 -21.69 L -14.6 -21.69 C -14.08 -33.54 -9.07 -39.14 0.01 -39.74 C 11.3 -39.4 13.99 -32.17 14.66 -21.64 L 14.62 -21.64 C 14.63 -21.62 14.65 -21.6 14.66 -21.58 C 14.19 -17.47 13.73 -13.35 13.26 -9.24 C 6.88 -10.68 -3.18 -12.21 -12.98 -8.8 Z M -14.64 -33.18 C -15.12 -33.17 -15.44 -33.56 -15.56 -34.48 C -15.51 -35.58 -13.18 -37.56 -12.74 -37.72 C -10.56 -37.37 -10.81 -36.19 -12.73 -34.27 C -13.52 -33.59 -14.16 -33.19 -14.64 -33.18 Z M 15.21 -33.26 C 14.74 -33.25 14.07 -33.6 13.26 -34.2 C 11.2 -35.96 10.85 -37.1 13 -37.63 C 13.45 -37.52 15.92 -35.72 16.07 -34.63 C 16.01 -33.67 15.72 -33.26 15.21 -33.26 Z", "#222", "#333", '');

                        construc.params.width = 200;
                        construc.params.height = 200;
                        construc.family = 'free';
                    }


                    if (typeObj === 'tree') {
                        let tree_color = "#090";
                        let green = 190 + Math.floor(Math.random() * 64);
                        tree_color = 'rgba(64,' + green + ',64,.8)';
                        pushToConstruc(construc, "m -15.27 18.68 C -15.15 18.13 -16.1 19.75 -16.99 18.58 C -17.88 17.41 -20.14 18.89 -19.51 19.38 C -18.89 19.87 -21.32 21.77 -22.54 19.08 C -22.87 18.36 -26.27 20.69 -24.63 17.03 C -24.39 16.5 -25.13 16.49 -25.46 16.48 C -28.85 16.37 -27.68 13.27 -27.68 13.27 L -25.67 11.57 C -25.67 11.57 -28.77 10.78 -25.97 9.47 C -25.45 9.22 -26.71 8.58 -27.18 8.26 C -29.17 6.92 -26.67 5.56 -26.67 5.56 C -26.67 5.56 -26.58 4.71 -27.18 4.66 C -28.37 4.55 -27.77 3.19 -27.99 3.56 C -29.53 6.14 -31.69 4.58 -32.63 3.36 C -33.15 2.67 -32.02 0.85 -32.02 0.85 C -32.02 0.85 -35.23 1.49 -33.87 -0.12 C -33.66 -0.37 -36.72 1.27 -36.06 -0.85 C -36.01 -1.01 -36.91 -1.28 -37.07 -1.35 C -38.57 -2.09 -38.1 -4.73 -33.64 -6.66 C -32.19 -7.28 -34.39 -8.03 -33.03 -9.97 C -31.86 -11.63 -30.19 -10.79 -30 -10.97 C -29.46 -11.49 -28.85 -13.31 -27.59 -12.18 C -26.13 -10.88 -25.56 -12.87 -25.56 -12.87 C -25.56 -12.87 -24.28 -14.03 -22.84 -13.07 C -21.67 -12.29 -22.26 -13.22 -22.13 -13.17 C -21.65 -12.98 -20.43 -13.12 -20.76 -13.62 C -22.3 -15.96 -22.66 -18.06 -18.7 -18.18 C -18.58 -18.18 -19.57 -19.75 -18.7 -20.08 C -17.56 -20.51 -18.74 -21.22 -18.7 -21.28 C -16.52 -24.95 -15.19 -21.28 -14.77 -22.59 C -12.84 -28.57 -11.4 -24.65 -9.83 -23.99 C -9.27 -23.75 -9.55 -25.56 -8.21 -24.99 C -7.7 -24.77 -6.96 -24.17 -6.6 -24.59 C -1.13 -30.97 0.93 -24.9 0.87 -23.89 C 0.85 -23.6 2.54 -25.2 2.88 -25.19 C 6.19 -25.12 4.09 -21.98 4.09 -21.98 C 4.09 -21.98 4.19 -21.05 5.71 -22.18 C 6.08 -22.46 6.87 -22.42 6.92 -22.89 C 7.24 -25.98 10.55 -24.09 10.55 -24.09 C 10.55 -24.09 10.92 -24.09 10.9 -23.86 C 10.72 -22.13 11.72 -23.46 11.86 -23.79 C 13.37 -27.15 15.8 -23.09 15.8 -23.09 C 15.8 -23.09 18.5 -24.6 18.12 -21.88 C 17.98 -20.93 16.97 -23.38 19.83 -21.58 C 21.11 -20.78 20.84 -19.48 20.84 -19.48 C 20.84 -19.48 23.65 -17.41 20.13 -16.07 C 18.76 -15.55 22.5 -16.39 23.67 -14.07 C 24.54 -12.34 23.67 -12.37 23.67 -12.37 C 23.67 -12.37 24.83 -11.51 25.1 -11.93 C 26.39 -13.93 26.86 -11.55 27.5 -11.67 C 28.76 -11.9 29.82 -8.96 29.82 -8.96 C 29.82 -8.96 32.22 -10.2 32.54 -7.76 C 32.69 -6.65 32.5 -4.62 31.43 -4.76 C 31.1 -4.8 31.97 -4.32 32.14 -3.76 C 32.29 -3.25 31.36 -2.76 31.74 -2.65 C 35.76 -1.52 33.96 1.75 33.96 1.75 C 33.96 1.75 37.27 3.78 33.15 6.76 C 32.5 7.23 33.55 8.56 33.55 8.56 C 33.55 8.56 32.66 10.37 31.43 9.77 C 30.71 9.41 33.6 10.42 33.85 11.97 C 33.97 12.68 32.94 13.62 32.44 13.27 C 31.94 12.92 32.81 15.15 32.85 15.78 C 32.91 16.89 31.49 18.2 30.63 18.28 C 29.65 18.37 29.84 16.5 27.7 18.68 C 27.15 19.24 29.53 19.84 26.49 20.68 C 25.23 21.03 23.72 21.71 22.56 20.58 C 22.11 20.15 23.39 18.61 21.45 19.08 C 21.02 19.19 20.67 19.75 20.74 20.18 C 21.29 23.73 17.81 23.09 17.81 23.09 C 17.81 23.09 15.84 21.71 15.09 22.29 C 14.08 23.06 13.88 21.59 13.88 21.59 C 13.88 21.59 12.78 21.05 12.17 22.89 C 11.92 23.63 14.17 23.83 11.76 25.19 C 11.17 25.53 11.63 27.28 10.05 26.29 C 9.5 25.95 9.07 27.13 8.53 27.49 C 6.96 28.56 6.59 25.65 6.11 26.39 C 4.6 28.75 3.49 26.19 3.49 26.19 C 3.49 26.19 1.91 28.08 1.27 25.09 C 1.16 24.59 0.76 23.86 0.97 23.49 C 1.44 22.64 1.39 22.89 0.51 23.31 C 0.31 23.41 0.57 24.07 -0.15 23.62 C -0.97 23.11 -0.98 24.04 -0.95 24.49 C -0.78 26.83 -2.87 25.89 -2.87 25.89 C -2.87 25.89 -2.9 27.6 -5.09 27.69 C -6.8 27.77 -7.09 24.13 -7.2 25.19 C -7.5 27.81 -8.9 25.43 -9.02 26.09 C -9.48 28.51 -10.55 25.93 -10.74 26.69 C -11 27.81 -11.18 26.48 -11.24 26.49 C -15.05 27.01 -13.06 25.64 -13.96 25.19 C -16.08 24.13 -13.96 23.26 -14.67 23.19 C -19.13 22.71 -14.27 19.48 -14.27 19.48 C -14.27 19.48 -15.53 19.8 -15.27 18.68 Z", tree_color, "#060", '');
                        construc.params.width = 200;
                        construc.params.height = 200;
                        construc.family = 'free';
                    }

                    if (typeObj === 'plant') {
                        let tree_color = "#090";
                        let tree_color2 = "#080";
                        let green = 190 + Math.floor(Math.random() * 64);
                        tree_color = 'rgba(64,' + green + ',64,.8)';
                        tree_color2 = 'rgba(64,' + (green - 32) + ',64,.8)';
                        pushToConstruc(construc, "m -5.29 21.79 C -4.63 16.56 -9.47 10.43 0 6.65 L 0 4.6 L -7.51 2.82 C -8.75 3.66 -9.96 3.97 -11.15 3.96 C -14.28 3.93 -17.27 1.72 -20.38 1.44 C -19.67 0.3 -18.79 -1.02 -17.76 -2.24 L -14.06 -1.29 L -19.57 1.28 L -14.42 -0.66 C -16.41 1.45 -15.62 1.57 -15.85 2.42 C -15.37 1.38 -15 0.11 -14.23 -0.32 L -9.66 -1.6 C -12.04 0.08 -11.53 1.55 -12.19 3.11 C -11.39 1.22 -10.84 -1.03 -9.08 -1.52 L -5 -2.26 C -8.92 -0.97 -7.96 0.73 -9.1 2.26 C -7.89 0.68 -7.34 -1.03 -4.67 -2.3 L -4.46 -2.39 L -4.65 -2.68 L -8.4 -2.25 C -11.15 -2.3 -14.05 -2.14 -15.73 -3.83 C -15.16 -2.24 -12.56 -1.98 -9.52 -1.98 L -13.36 -1.44 L -17.75 -2.25 C -14.98 -5.53 -11.06 -8.13 -6.03 -4.75 L -6.2 -5 L -2.4 -5.4 L -0.63 -9.1 C -5.13 -14.9 0.39 -18.66 1.46 -23.32 C 2.49 -22.46 3.68 -21.41 4.75 -20.21 L 3.29 -16.68 L 1.51 -22.5 L 2.72 -17.13 C 0.9 -19.39 0.68 -18.61 -0.13 -18.97 C 0.83 -18.35 2.04 -17.8 2.36 -16.98 L 3 -12.28 C 1.66 -14.87 0.13 -14.57 -1.32 -15.43 C 0.44 -14.38 2.6 -13.53 2.84 -11.71 L 3.01 -7.58 C 2.27 -11.63 0.46 -10.92 -0.9 -12.26 C 0.49 -10.84 2.12 -10.06 3.01 -7.24 L 3.12 -6.84 L 3.58 -6.99 C 4.59 -9.54 5.58 -12.17 6.83 -13.3 C 5.05 -12.32 4.2 -9.74 3.38 -7.11 L 3.47 -10.94 C 3.9 -13.66 4.14 -16.55 6.04 -17.98 C 4.39 -17.64 3.77 -15.1 3.36 -12.09 L 3.35 -15.96 L 4.75 -20.21 C 7.8 -16.81 9.92 -12.23 4.78 -7.39 L 6.6 -8 L 7.4 -4.2 L 7.79 -3.47 C 17.05 -8.38 18.05 -0.48 22.21 2.53 C 21.04 3.21 19.64 3.98 18.15 4.58 L 15.57 1.92 L 21.46 2.28 L 16.19 1.52 C 18.92 0.58 18.32 0.09 18.96 -0.57 C 18.02 0.14 17.06 1.1 16.21 1.12 L 11.76 0.05 C 14.59 -0.31 14.92 -1.89 16.26 -2.98 C 14.64 -1.66 13.03 0.11 11.32 -0.3 L 9.03 -1.11 L 9.4 -0.4 L 10.38 0.03 C 12.64 1.42 15.12 2.68 15.66 5.03 C 16 3.32 13.97 1.8 11.45 0.33 L 14.91 1.71 L 18.14 4.59 C 16.59 5.22 14.94 5.67 13.37 5.66 C 10.76 5.64 8.35 4.35 6.88 0.48 L 5.4 1 L 3.41 8.31 C 6.43 14.55 2.89 18.01 -1.12 20.07 L -0.98 15.62 L 0.37 12.02 C -0.28 14.96 -0.57 17.55 0.86 18.46 C -0.44 16.45 0.34 13.67 0.87 10.98 L 0.94 10.76 L 0.16 11.12 L 0.01 11.48 C -0.85 13.08 -3.17 13.1 -5.18 13.45 C -3.52 13.17 -2.18 13.99 -0.04 12.06 L -2.26 16.21 C -2.84 16.86 -4.16 16.94 -5.29 17.17 C -4.4 17.13 -4.46 17.93 -1.96 16.48 L -4.95 21.05 L -1.27 16.27 L -1.12 20.08 C -2.54 20.81 -4.02 21.36 -5.29 21.79 Z M 3.22 14.38 C 2.7 13.38 2.51 11.81 2.42 10.07 L 2.04 10.25 C 2.09 11.9 2.36 13.38 3.22 14.38 Z M -3.71 10.65 C -2.44 10.09 -1.32 10.64 0 9.63 L 0 9 C -1.24 9.84 -2.47 10.08 -3.71 10.65 Z M 11.17 4.11 C 11.03 2.58 9.92 1.22 8.52 -0.09 L 8.13 0.04 C 9.53 1.48 10.77 2.88 11.17 4.11 Z M 9.13 -1.46 C 11.53 -1.48 11.81 -3.01 13.26 -3.71 C 11.78 -3.02 10.61 -2.04 8.67 -1.79 L 8.84 -1.46 C 8.94 -1.46 9.04 -1.46 9.13 -1.46 Z M -4.66 -2.7 L -4.86 -2.99 C -7.41 -3.6 -9.96 -4.22 -11.19 -5.25 C -9.99 -3.64 -7.36 -3.15 -4.66 -2.7 Z", tree_color, "#060", '');
                        pushToConstruc(construc, "m 22.62 27.37 C 14.5 20.86 -0.58 23.82 4.07 -0.04 C 20.7 -1.41 23.73 9.01 23.5 18.73 L 16.64 14.24 L 12.15 8.54 C 16.21 12.45 20.02 15.41 22.67 13.88 C 18.4 14.13 14.71 10.17 10.96 6.72 L 6.38 1.21 C 10.56 4.05 14.73 6.78 18.29 6.03 C 14.96 5.9 9.95 2.72 5.2 0.02 L 6.04 1.85 C 8.06 7.02 6.81 10.16 6.54 13.91 C 6.9 10.38 10.09 9.13 6.42 2.34 L 11.01 8.62 C 12.78 11.59 10.82 15.5 9.64 19.2 C 10.63 16.15 13.06 14.7 11.88 9.26 L 16.47 16.95 C 16.98 18.55 15.98 20.84 15.38 22.94 C 16.08 21.42 17.28 22.28 17.14 16.71 L 21.73 26.09 L 17.4 15.36 L 23.5 18.75 C 23.42 21.82 23.02 24.83 22.62 27.37 Z M -11.08 17.95 C -13.45 17.94 -15.95 17.38 -18.35 16.58 L -13.34 11.42 L -7.7 8.76 C -11.73 11.48 -14.92 14.23 -14.06 17.07 C -13.54 13.07 -9.53 10.7 -5.94 8.14 L -0.45 5.35 C -3.59 8.47 -6.63 11.6 -6.59 15.09 C -5.92 12.04 -2.34 8.25 0.77 4.57 L -0.94 4.86 C -5.78 5.39 -8.26 3.34 -11.49 2.11 C -8.39 3.32 -7.96 6.73 -1.42 5.09 L -7.57 7.68 C -10.42 8.54 -13.43 5.71 -16.4 3.65 C -13.96 5.36 -13.13 7.99 -8.27 8.32 L -15.64 10.55 C -17.09 10.61 -18.88 9.08 -20.58 7.97 C -19.39 9.02 -20.33 9.91 -15.55 11.23 L -24.35 13.02 L -14.43 11.83 L -18.37 16.57 C -20.99 15.7 -23.49 14.54 -25.6 13.5 C -18.65 7.71 -18.62 -6.99 1.01 3.54 C -0.16 14.7 -5.26 17.98 -11.08 17.95 Z M 6.33 -3.59 C 1 -18.37 9.35 -23.02 17.91 -24.59 L 15.68 -17.57 L 11.82 -12.47 C 14.23 -16.85 15.87 -20.83 13.88 -22.95 C 15.15 -19.14 12.6 -15.08 10.52 -11.05 L 6.84 -5.91 C 8.29 -10.21 9.64 -14.47 8.09 -17.56 C 8.81 -14.52 7.28 -9.41 6.1 -4.63 L 7.49 -5.72 C 11.57 -8.54 14.65 -7.92 18.06 -8.4 C 14.78 -7.97 12.92 -10.78 7.82 -6.16 L 12.17 -11.45 C 14.33 -13.59 18.23 -12.54 21.76 -12.15 C 18.85 -12.48 16.98 -14.42 12.52 -12.35 L 18.09 -17.91 C 19.36 -18.67 21.62 -18.17 23.61 -18.02 C 22.1 -18.37 22.55 -19.62 17.72 -18.47 L 24.78 -24.34 L 16.47 -18.46 L 17.92 -24.59 C 20.63 -25.08 23.35 -25.27 25.67 -25.37 C 22 -16.85 28.34 -3.76 6.33 -3.59 Z M -4.67 -4.64 C -23.23 -4.73 -18.35 -17.34 -22.31 -25.22 C -19.99 -25.27 -17.26 -25.26 -14.53 -24.94 L -12.73 -18.91 L -21.35 -24.24 L -13.98 -18.84 C -18.86 -19.68 -18.34 -18.47 -19.83 -18.01 C -17.85 -18.3 -15.63 -18.93 -14.32 -18.26 L -8.44 -13.07 C -13.01 -14.85 -14.76 -12.79 -17.65 -12.28 C -14.15 -12.89 -10.32 -14.19 -8.04 -12.19 L -3.39 -7.19 C -8.76 -11.48 -10.45 -8.54 -13.75 -8.77 C -10.32 -8.5 -7.28 -9.33 -3.04 -6.77 L -1.58 -5.77 C -3.03 -10.47 -4.86 -15.47 -4.32 -18.55 C -5.68 -15.37 -4.09 -11.2 -2.4 -7 L -6.37 -11.9 C -8.68 -15.79 -11.45 -19.67 -10.4 -23.55 C -12.27 -21.32 -10.39 -17.45 -7.74 -13.23 L -11.89 -18.07 L -14.51 -24.93 C -5.89 -23.92 2.72 -19.82 -1.76 -4.72 C -2.79 -4.66 -3.76 -4.64 -4.67 -4.64 Z", tree_color, "#090", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }




                    if (typeObj === 'pond') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 40), "#47aae7", "#47aae7", '');
                        construc.params.width = 80;
                        construc.params.height = 80;
                        construc.family = 'free';
                    }
                    /*
			        if (typeObj === 'pool') {
			        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#99f", "#99f", '');
			        construc.params.width = 80;
			        construc.params.height = 80;
			        construc.family = 'free';
			        }
			                */


                    // Fire escape map

                    if (typeObj === 'arrow') {
                        pushToConstruc(construc, "m 50 1 L 36 15 L 36 4.08 L -49 4.08 L -49 -2.08 L 36 -2.08 L 36 -13 Z", "#f00", "#888", '');
                        construc.params.width = 100;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'line-with-dot') {
                        pushToConstruc(construc, "m 144 7 C 141.03 7 138.56 4.84 138.08 2 L -150 2 L -150 0 L 138.08 0 C 138.56 -2.84 141.03 -5 144 -5 C 147.31 -5 150 -2.31 150 1 C 150 4.31 147.31 7 144 7 Z", "#f00", "#f00", '');
                        construc.params.width = 100;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'red-rectangle') {
                        pushToConstruc(construc, "m -70 20 L 70 20 L 70 -20 L -70 -20 Z", "#f00", "#f00", '');
                        construc.params.width = 100;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'fire-extinguisher') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#333", '');
                        construc.push({
                            'text': "🧯",
                            'x': '0',
                            'y': '10',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '1.5em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'fire-hose') {
                        pushToConstruc(construc, "m 29.77 -29.77 L 29.77 30.03 L -30.03 30.03 L -30.03 -29.77 Z", "#f00", "#333", '');
                        pushToConstruc(construc, "m 17.36 22.11 L 17.36 20.07 L 21.46 20.07 L 21.46 22.11 L 17.36 22.11 Z M 18.04 19.18 L 17.55 5.05 L 21.28 5.05 L 20.81 19.17 L 18.04 19.18 Z M 16.48 4.24 L 16.48 1.8 L 22.33 1.8 L 22.33 4.24 L 16.48 4.24 Z", "#fff", "#333", '');
                        pushToConstruc(construc, "m -3.27 -2.47 C -1.99 -3.47 -0.23 -2.48 0.38 -1.2 C 1.42 0.99 -0.09 3.47 -2.21 4.25 C -5.28 5.39 -8.53 3.32 -9.48 0.35 C -10.72 -3.57 -8.07 -7.63 -4.25 -8.72 C 0.53 -10.09 5.39 -6.85 6.63 -2.18 C 8.12 3.45 4.29 9.13 -1.23 10.51 C -7.72 12.12 -14.21 7.7 -15.73 1.33 C -17.47 -6.01 -12.45 -13.32 -5.23 -14.97 C 2.96 -16.85 11.09 -11.23 12.88 -3.16 C 14.89 5.88 8.67 14.83 -0.25 16.76 C -10.15 18.89 -19.92 12.08 -21.98 2.31 C -24.25 -8.44 -16.84 -19.03 -6.21 -21.23 C 5.39 -23.62 16.8 -15.62 19.13 -4.14 C 19.47 -2.48 19.62 -0.78 19.57 0.91", "#fff", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }



                    if (typeObj === 'fire-exit') {
                        pushToConstruc(construc, "m -40,-20 l 80,0 l0,40 l-80,0 Z", "#0f0", "#333", '');
                        construc.push({
                            'text': "EXIT",
                            'x': '0',
                            'y': '6',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '1.2em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'fire-exit2') {

                        //pushToConstruc(construc, "m 22.42 11.08 L 22.42 -10.84 L -22.83 -10.84 L -22.83 11.08 L 22.42 11.08 Z", "#00B200", "#fff", '');
                        pushToConstruc(construc, "m 44.83 22.17 L 44.83 -21.69 L -45.66 -21.69 L -45.66 22.17 L 44.83 22.17 Z", "#00B200", "#fff", '');
                        pushToConstruc(construc, "m -41.16 17.31 L -41.16 -16.79 L -23.96 -16.79 L -23.96 17.31 L -41.16 17.31 Z M -12.98 4.39 L -20.23 0.34 L -12.98 -3.72 L -12.98 -0.66 L 11.22 -0.66 L 11.22 1.08 L -12.98 1.08 L -12.98 4.39 Z", "#fff", "none", '');
                        pushToConstruc(construc, "m 22.25 17.69 L 21.89 6.75 L 26.76 3.68 C 26.76 3.68 27.49 2.92 27.13 2.34 C 26.76 1.76 25.5 -1.11 25.5 -1.11 L 24.59 1.96 L 16.1 2.72 L 15.74 -1.3 L 20.8 -1.5 C 20.8 -1.5 20.44 -7.45 21.16 -7.64 C 21.89 -7.83 25.32 -9.75 25.86 -10.71 L 34 -10.33 L 37.07 -4.19 L 34.54 -2.27 L 31.1 -7.26 L 29.29 -6.49 L 33.82 1.19 C 33.82 1.19 34.54 7.52 34.18 8.48 C 33.82 9.44 39.6 6.56 40.69 8.29 L 40.14 12.32 L 30.38 12.32 L 30.74 6.37 L 26.59 9.25 L 25.86 17.69 L 22.25 17.69 Z M 21.21 -8.89 C 18.95 -8.89 17.12 -10.83 17.12 -13.23 C 17.12 -15.63 18.95 -17.57 21.21 -17.57 C 23.47 -17.57 25.3 -15.63 25.3 -13.23 C 25.3 -10.83 23.47 -8.89 21.21 -8.89 Z", "#fff", "none", '');
                        construc.params.width = 60;
                        construc.params.height = 30;
                        construc.family = 'free';
                    }

                    if (typeObj === 'fire-extinguisher') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#f00", '');
                        construc.push({
                            'text': "🧯",
                            'x': '0',
                            'y': '10',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '1.5em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }

                    if (typeObj === 'meeting-point') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#f00", '');
                        construc.push({
                            'text': " 🚩 ",
                            'x': '3',
                            'y': '10',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '1.8rem',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'free';
                    }




                    if (typeObj === 'switch') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
                        pushToConstruc(construc, qSVG.circlePath(-2, 4, 5), "none", "#333", '');
                        pushToConstruc(construc, "m 0,0 5,-9", "none", "#333", '');
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';

                    }
                    if (typeObj === 'doubleSwitch') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 4), "none", "#333", '');
                        pushToConstruc(construc, "m 2,-3 5,-8 3,2", "none", "#333", '');
                        pushToConstruc(construc, "m -2,3 -5,8 -3,-2", "none", "#333", '');
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'dimmer') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
                        pushToConstruc(construc, qSVG.circlePath(-2, 4, 5), "none", "#333", '');
                        pushToConstruc(construc, "m 0,0 5,-9", "none", "#333", '');
                        pushToConstruc(construc, "M -2,-6 L 10,-4 L-2,-2 Z", "none", "#333", '');

                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }



                    if (typeObj === 'plug') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#333", '');
                        construc.push({
                            'text': "⚇",
                            'x': '0',
                            'y': '10',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '2.5rem',
                            "strokeWidth": "0.4px"
                        });
                        //pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        //pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
                        //pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
                        //pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'plug20') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
                        pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
                        pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');

                        construc.push({
                            'text': "20A",
                            'x': '0',
                            'y': '-5',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '0.65em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'plug32') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
                        pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
                        pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');

                        construc.push({
                            'text': "32A",
                            'x': '0',
                            'y': '-5',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '0.65em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'roofLight') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "rgba(255,255,200,.7)", "rgba(0,0,0,.5)", '');
                        //pushToConstruc(construc, "M -8,-8 L 8,8 M -8,8 L 8,-8", "none", "#333", '');

                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'free';
                    }

                    if (typeObj === 'wallLight') {
                        pushToConstruc(construc, "m 40 20 L 40 20 C 40 -2.09 22.09 -20 0 -20 C -22.09 -20 -40 -2.09 -40 20 L 40 20 Z", "rgba(255,255,200,.7)", "rgba(0,0,0,.5)", '');
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    /*
			        if (typeObj === 'wallLight') {
			            pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
			            pushToConstruc(construc, "M -8,-8 L 8,8 M -8,8 L 8,-8", "none", "#333", '');
			            pushToConstruc(construc, "M -10,10 L 10,10", "none", "#333", '');

			            construc.params.width = 36;
			            construc.params.height = 36;
			            construc.family = 'stick';
			        }
			                */


                    if (typeObj === 'www') {
                        pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#333", '');

                        construc.push({
                            'text': "@",
                            'x': '0',
                            'y': '10',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '1.6rem',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 40;
                        construc.params.height = 40;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'rj45') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        pushToConstruc(construc, "m-10,5 l0,-10 m20,0 l0,10", "none", "#333", '');
                        pushToConstruc(construc, "m 0,5 v 7", "none", "#333", '');
                        pushToConstruc(construc, "m -10,5 h 20", "none", "#333", '');

                        construc.push({
                            'text': "RJ45",
                            'x': '0',
                            'y': '-5',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '0.5em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'tv-plug') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        pushToConstruc(construc, "m-10,5 l0-10 m20,0 l0,10", "none", "#333", '');
                        pushToConstruc(construc, "m-7,-5 l0,7 l14,0 l0,-7", "none", "#333", '');
                        pushToConstruc(construc, "m 0,5 v 7", "none", "#333", '');
                        pushToConstruc(construc, "m -10,5 h 20", "none", "#333", '');

                        construc.push({
                            'text': "TV",
                            'x': '0',
                            'y': '-5',
                            'fill': "#333333",
                            'stroke': "none",
                            'fontSize': '0.5em',
                            "strokeWidth": "0.4px"
                        });
                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }

                    if (typeObj === 'heater') {
                        pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
                        pushToConstruc(construc, "m-15,-4 l30,0", "none", "#333", '');
                        pushToConstruc(construc, "m-14,-8 l28,0", "none", "#333", '');
                        pushToConstruc(construc, "m-11,-12 l22,0", "none", "#333", '');
                        pushToConstruc(construc, "m-16,0 l32,0", "none", "#333", '');
                        pushToConstruc(construc, "m-15,4 l30,0", "none", "#333", '');
                        pushToConstruc(construc, "m-14,8 l28,0", "none", "#333", '');
                        pushToConstruc(construc, "m-11,12 l22,0", "none", "#333", '');

                        construc.params.width = 36;
                        construc.params.height = 36;
                        construc.family = 'stick';
                    }
                    if (typeObj === 'radiator') {
                        /*
			            pushToConstruc(construc, "m -20,-10 l 40,0 l0,20 l-40,0 Z", "#fff", "#333", '');
			            pushToConstruc(construc, "M -15,-10 L -15,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M -10,-10 L -10,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M -5,-10 L -5,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M -0,-10 L -0,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M 5,-10 L 5,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M 10,-10 L 10,10", "#fff", "#333", '');
			            pushToConstruc(construc, "M 15,-10 L 15,10", "#fff", "#333", '');
			                    */

                        pushToConstruc(construc, "m -67.87 15 C -71.63 15 -74.68 13.89 -74.68 12.52 L -74.68 -12.9 C -74.68 -14.27 -71.63 -15.39 -67.87 -15.39 C -64.11 -15.39 -61.06 -14.27 -61.06 -12.9 L -61.06 12.52 C -61.06 13.89 -64.11 15 -67.87 15 Z M -54.24 15 C -58 15 -61.05 13.89 -61.05 12.52 L -61.05 -12.9 C -61.05 -14.27 -58 -15.39 -54.24 -15.39 C -50.48 -15.39 -47.44 -14.27 -47.44 -12.9 L -47.44 12.52 C -47.44 13.89 -50.48 15 -54.24 15 Z M -40.62 15 C -44.38 15 -47.43 13.89 -47.43 12.52 L -47.43 -12.9 C -47.43 -14.27 -44.38 -15.39 -40.62 -15.39 C -36.86 -15.39 -33.81 -14.27 -33.81 -12.9 L -33.81 12.52 C -33.81 13.89 -36.86 15 -40.62 15 Z M -27 15 C -30.76 15 -33.81 13.89 -33.81 12.52 L -33.81 -12.9 C -33.81 -14.27 -30.76 -15.39 -27 -15.39 C -23.24 -15.39 -20.19 -14.27 -20.19 -12.9 L -20.19 12.52 C -20.19 13.89 -23.24 15 -27 15 Z M -13.37 15 C -17.13 15 -20.18 13.89 -20.18 12.52 L -20.18 -12.9 C -20.18 -14.27 -17.13 -15.39 -13.37 -15.39 C -9.61 -15.39 -6.56 -14.27 -6.56 -12.9 L -6.56 12.52 C -6.56 13.89 -9.61 15 -13.37 15 Z M 0.25 15 C -3.51 15 -6.56 13.89 -6.56 12.52 L -6.56 -12.9 C -6.56 -14.27 -3.51 -15.39 0.25 -15.39 C 4.01 -15.39 7.06 -14.27 7.06 -12.9 L 7.06 12.52 C 7.06 13.89 4.01 15 0.25 15 Z M 13.88 15 C 10.11 15 7.07 13.89 7.07 12.52 L 7.07 -12.9 C 7.07 -14.27 10.11 -15.39 13.88 -15.39 C 17.62 -15.39 20.66 -14.28 20.68 -12.92 C 20.71 -14.28 23.74 -15.39 27.49 -15.39 C 31.25 -15.39 34.3 -14.27 34.3 -12.9 L 34.3 12.52 C 34.3 13.89 31.25 15 27.49 15 C 23.73 15 21.06 15.03 21.06 13.66 L 20.68 -12.77 L 20.68 12.52 C 20.68 13.89 17.63 15 13.88 15 Z M 47.92 12.52 C 47.92 13.89 44.87 15 41.11 15 C 37.35 15 34.31 13.89 34.31 12.52 L 34.31 -12.9 C 34.31 -14.27 37.35 -15.39 41.11 -15.39 C 44.87 -15.39 47.92 -14.27 47.92 -12.9 L 47.92 12.52 Z M 61.55 12.52 C 61.55 13.89 58.5 15 54.74 15 C 50.98 15 47.93 13.89 47.93 12.52 L 47.93 -12.9 C 47.93 -14.27 50.98 -15.39 54.74 -15.39 C 58.5 -15.39 61.55 -14.27 61.55 -12.9 L 61.55 12.52 Z M 75.17 12.52 C 75.17 13.89 72.12 15 68.36 15 C 64.6 15 61.55 13.89 61.55 12.52 L 61.55 -12.9 C 61.55 -14.27 64.6 -15.39 68.36 -15.39 C 72.12 -15.39 75.17 -14.27 75.17 -12.9 L 75.17 12.52 Z", "#fff", "#333", '');
                        construc.params.width = 40;
                        construc.params.height = 10;
                        construc.family = 'stick';
                    }
                }

                if (classObj === 'furniture') {
                    //construc.params.bindBox = true;
                    construc.params.bindBox = false;
                    construc.params.move = true;
                    construc.params.resize = true;
                    construc.params.rotate = true;
                }

                return construc;
            }

            function setBestEqPoint(bestEqPoint, distance, index, x, y, x1, y1, x2, y2, way) {
                bestEqPoint.distance = distance;
                bestEqPoint.node = index;
                bestEqPoint.x = x;
                bestEqPoint.y = y;
                bestEqPoint.x1 = x1;
                bestEqPoint.y1 = y1;
                bestEqPoint.x2 = x2;
                bestEqPoint.y2 = y2;
                bestEqPoint.way = way;
            }

            function pushToRibMaster(ribMaster, firstIndex, secondIndex, wallIndex, crossEdge, side, coords, distance) {
                ribMaster[firstIndex][secondIndex].push({
                    wallIndex: wallIndex,
                    crossEdge: crossEdge,
                    side: side,
                    coords: coords,
                    distance: distance
                });
            }

            function pushToConstruc(construc, path, fill, stroke, strokeDashArray, opacity = 1) {
                construc.push({
                    'path': path,
                    'fill': fill,
                    'stroke': stroke,
                    'strokeDashArray': strokeDashArray,
                    'opacity': opacity
                });
            }


            function getRandomColor() {
                var letters = '789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * letters.length)];
                }
                return color;
            }


            function get_svg() {
                let svg_clone = document.getElementById('extension-floorplanner-lin').cloneNode(true);
                //console.log("svg_clone: ", svg_clone);
                svg_clone.querySelector("g#extension-floorplanner-boxgrid").remove();
                svg_clone.querySelector("g#extension-floorplanner-boxScale").remove();
                svg_clone.querySelector("g#extension-floorplanner-boxRib").remove();
                svg_clone.querySelector("g#extension-floorplanner-boxbind").remove();
                svg_clone.querySelector("g#extension-floorplanner-boxArea").remove();
                svg_clone.querySelector("g#extension-floorplanner-boxMeasure").remove();
                return svg_clone;
            }


            function saveSvg(svgEl, name) {
                svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                var svgData = svgEl.outerHTML;
                var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                var svgBlob = new Blob([preface, svgData], {
                    type: "image/svg+xml;charset=utf-8"
                });
                var svgUrl = URL.createObjectURL(svgBlob);
                var downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = name;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }


            function download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }

            // SVG download button
            document.getElementById("extension-floorplanner-svg-download-button").addEventListener("click", function() {
                saveSvg(get_svg(), "floorplanner.svg");
            }, false);


            function hide_submenus() {
                document.querySelectorAll('.extension-floorplanner-sub').forEach(function(element) {
                    element.style.display = 'none';
                });
                panel_el.style.display = 'block';
            }


            function toggle_furniture() {
                //console.log("in toggle_furniture");

                let energy_list_el = document.getElementById('extension-floorplanner-energy_list');

                //console.log("display?", energy_list_el.style.display);
                if (energy_list_el.style.display == 'block') {
                    hide_submenus();
                    //energy_list_el.style.display='none';
                } else {
                    hide_submenus();
                    energy_list_el.style.display = 'block';
                }
                set_linked_scaling(true);
            }


            function toggle_layers() {
                let showing = window.getComputedStyle(document.getElementById("extension-floorplanner-layer_list"), null); //.getPropertyCSSValue("display").cssText;
                //console.log("showing: ", showing);
                //console.log("showing 2: ", showing.getPropertyValue('display'));
                //hide_submenus();
                if (showing.getPropertyValue('display') == 'block') {
                    document.querySelector('#extension-floorplanner-layer_list').style.display = 'none';
                } else {
                    document.querySelector('#extension-floorplanner-layer_list').style.display = 'block';
                }
            }


            function toggle_object_list() {
                let showing = window.getComputedStyle(document.getElementById("extension-floorplanner-object_list"), null); //.getPropertyCSSValue("display").cssText;
                //console.log("showing: ", showing);
                //console.log("showing 2: ", showing.getPropertyValue('display'));
                //hide_submenus();
                if (showing.getPropertyValue('display') == 'block') {
                    document.querySelector('#extension-floorplanner-object_list').style.display = 'none';
                } else {
                    document.querySelector('#extension-floorplanner-object_list').style.display = 'block';
                }
            }


            function new_floorplan() {
				console.log("in new_floorplan. current_filename: ", typeof current_filename, current_filename);
                if ((WALLS.length || ROOM.length || OBJDATA.length) && current_filename != null) {
                    document.getElementById('extension-floorplanner-plan-exists-warning').style.display = 'block';
                } else {
                    document.getElementById('extension-floorplanner-plan-exists-warning').style.display = 'none';
                }
                document.querySelector('#extension-floorplanner-newFileModal').style.display = 'block';
            }


            function clear_floorplan(force = false, clear_local_storage = true) {
                //console.log("in clear_floorplan. force: ", force);

                if (WALLS.length == 0 && ROOM.length == 0 && OBJDATA.length == 0) {
                    //console.log("clear_floorplan: WALLS, ROOM and OBJDATA are empty, setting force to true");
                    force = true;
                }

                if (force == false) {
                    force = confirm("Are you sure you want to erase everything on the current floorplan?");
                }

                if (force) {
                    //console.log("clearing floorplan");
                    if (clear_local_storage) {
                        localStorage.removeItem('extension-floorplanner-history');
                        //current_filename = null;
                        //localStorage.removeItem('extension-floorplanner-current-filename');
                        //document.getElementById('extension-floorplanner-current-filename').textContent = '';
                    }

                    for (let k in OBJDATA) {
                        OBJDATA[k].graph.remove();
                    }

                    //current_filename = null;
                    WALLS = [];
                    OBJDATA = [];
                    ROOM = [];
                    HISTORY = [];
                    wallSize = 20;
                    partitionSize = 8;
                    drag = 'off';
                    action = 0;
                    magnetic = 0;
                    construc = 0;
                    Rcirclebinder = 8;
                    mode = 'select_mode';
                    grid = 20;
                    meter = 60;
                    colorline = "#fff";
                    colorroom = "#f0daaf";
                    colorWall = "#666";
					skip_first_save_to_floorplans = true;
                    //pox = 0;
                    //poy = 0;
                    segment = 0;
                    //xpath = 0;
                    //ypath = 0;
                    //width_viewbox = taille_w;
                    //height_viewbox = taille_h;
                    //ratio_viewbox = height_viewbox / width_viewbox;
                    //originX_viewbox = 0;
                    //originY_viewbox = 0;
                    //zoom = 9;
                    //factor = 1;

                    sizeText = [];
                    showAllSizeStatus = 0;

                    document.querySelector("g#extension-floorplanner-boxText").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxgrid").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxScale").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxRib").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxMeasure").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxbind").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxArea").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxpath").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxSurface").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxwall").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxRoom").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxcarpentry").replaceChildren();
                    document.querySelector("g#extension-floorplanner-boxEnergy").replaceChildren();
                }
				remove_background_image();
            }
			
			
			function clear_local_storage(){
				console.warn("in clear_local_storage");
                localStorage.removeItem('extension-floorplanner-floorplans');
				localStorage.removeItem('extension-floorplanner-history');
				localStorage.removeItem('extension-floorplanner-settings');
                localStorage.removeItem('extension-floorplanner-current-filename');
				localStorage.removeItem('extension-floorplanner-currently-editing');
				localStorage.removeItem('extension-floorplanner-visible-things');
			}
			


			function remove_background_image(){
                bg_image_el.style.backgroundImage = "none";
                bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');
                bg_image_el.style.opacity = '0';
			}


            function delete_floorplan() {
                if (confirm("Are you sure you want to delete this floorplan?")) {
                    if (current_filename == null) {
                        console.error("cannot delete, no current floorplan set. Attempting clear instead");
                        clear_floorplan();
                    } else if (typeof floorplans[current_filename] != 'undefined') {
                        //console.error("deleting: ", current_filename);
                        delete floorplans[current_filename];
                        localStorage.setItem('extension-floorplanner-floorplans', JSON.stringify(floorplans));
                        localStorage.removeItem('extension-floorplanner-current-filename');
                        clear_floorplan(true);
                        document.getElementById('extension-floorplanner-current-filename').textContent = '';
                        generate_floorplans_list();
                    }

                    if (floorplans.length == 0) {
                        //console.log("all floorplans have been deleted");
                    } else {
                        console.warn('cannot delete, no current_filename');
                        //floorplans[floorplans.length-1];
                    }
                    generate_floorplans_list(true);
                }
            }


            function save_to_floorplans() {
				if(skip_first_save_to_floorplans){
					skip_first_save_to_floorplans = false;
					return
				}
                //console.log("in save_to_floorplans. HISTORY: ", HISTORY);
                if (HISTORY.length) {
                    let last_version = HISTORY[HISTORY.length - 1];
                    //console.log("save_to_floorplans: last_version: ", last_version);
                    let svg_image = get_svg();
                    //console.log("svg_image: ", svg_image);

                    svg_image.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    var svgData = svg_image.outerHTML;
                    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                    var svgBlob = new Blob([preface, svgData], {
                        type: "image/svg+xml;charset=utf-8"
                    });
                    var svgUrl = '' + URL.createObjectURL(svgBlob);

                    if (current_filename == null) {
                        current_filename = prompt("Please enter the floorplan's name", "Ground floor");
                    }
                    //let floorplans_length = Object.keys(floorplans).length;
                    if (current_filename != null && current_filename.length > 0) {
                        if (typeof floorplans[current_filename] == 'undefined') {
                            floorplans[current_filename] = {
                                'index': Object.keys(floorplans).length,
                                'name': current_filename,
                                'svg_data': svgData.replaceAll(' id=', ' xid='),
                                //'svg_image_url':svgUrl,
                                'floorplan': last_version
                            }
                        } else {
                            // index is not overwritten, as the user migth have re-ordered the floorplan icons.
                            floorplans[current_filename]['name'] = current_filename;
                            floorplans[current_filename]['svg_data'] = svgData.replaceAll(' id=', ' xid=');
                            //floorplans[current_filename]['svg_image_url'] = svgUrl;
                            floorplans[current_filename]['floorplan'] = last_version;
                        }

                        //console.log("floorplans is now: ", floorplans);
                        localStorage.setItem('extension-floorplanner-floorplans', JSON.stringify(floorplans));
                        unsaved = false;
                        document.getElementById('extension-floorplanner-plan-exists-warning').style.display = 'none';
                    }
                    localStorage.setItem('extension-floorplanner-current-filename', JSON.stringify(current_filename));

                    generate_floorplans_list();


                }
                /*
			    floorplanLoad(historyTemp.length - 1, "boot");
			if (HISTORY.index < HISTORY.length) {
			    HISTORY.splice(HISTORY.index, (HISTORY.length - HISTORY.index));
			    document.querySelector('#extension-floorplanner-redo').classList.add('extension-floorplanner-disabled');
			}
			HISTORY.push(JSON.stringify({ objData: OBJDATA, wallData: WALLS, roomData: ROOM }));
			    //console.log("pushed HISTORY: ", HISTORY);
			localStorage.setItem('extension-floorplanner-history', JSON.stringify(HISTORY));
			    //console.log("localstorage: ", localStorage.getItem('extension-floorplanner-history'));
			HISTORY.index++;
			if (HISTORY.index > 1) document.querySelector('#extension-floorplanner-undo').classList.remove('extension-floorplanner-disabled');
			    */
            }


            function save_floorplan_as() {
                let copy_filename_suggestion = current_filename;
                if (copy_filename_suggestion == null) {
                    copy_filename_suggestion = "Ground floor";
                } else {
                    copy_filename_suggestion = copy_filename_suggestion + ' (copy)';
                }
                let copy_filename = prompt("Please enter the floorplan's name", copy_filename_suggestion);
                //console.log("copy_filename: ", copy_filename);
                if (copy_filename != null && copy_filename.length > 0) {
                    current_filename = copy_filename;
                    save_to_floorplans();
                }
            }


            function generate_floorplans_list(load_whatever = false) {
                //console.log("in generate_floorplans_list. floorplanner_started,current_filename: ", floorplanner_started,current_filename);
                floorplans_list_el.innerHTML = '';
                let floorplans_length = Object.keys(floorplans).length;

                for (var p = 0; p < floorplans_length + 10; p++) {

                    for (const [key, details] of Object.entries(floorplans)) {
                        //console.log(`${key}: ${details}`);
                        if (typeof details.index != 'undefined') {
                            //console.log(p, "p =?= details.index?: ", details.index);
                            if (p == details.index) {
                                let floorplan_el = document.createElement('li');
                                floorplan_el.classList.add('extension-floorplanner-floorplan-item');

                                if (typeof floorplans[key].name == 'string' && typeof current_filename == 'string') {
                                    //console.log("both strings");
                                    if (floorplans[key].name == current_filename) {
                                        //console.log("NAMES MATCH. floorplan_el: ", floorplan_el);
                                        floorplan_el.classList.add('extension-floorplanner-floorplan-icon-current');
                                        setTimeout(() => {
                                            floorplan_el.scrollIntoView(true);
                                        }, 1);
                                        //floorplan_el.style.backgroundColor='purple';
                                        //floorplan_name_el.classList.add('extension-floorplanner-floorplan-icon-current');
                                    }
                                }

                                /*
                                let floorplan_image_el = document.createElement('img');
                                floorplan_image_el.classList.add('extension-floorplanner-floorplan-item-icon');
                                floorplan_image_el.src = details.svg_image_url;
                                floorplan_image_el.alt = details.name + ' thumbnail image';
                                floorplan_el.appendChild(floorplan_image_el);
                                */
                                let floorplan_image_el = document.createElement('div');
                                floorplan_image_el.classList.add('extension-floorplanner-floorplan-item-icon');

                                //if(current_filename != null && current_filename != details.name){
                                //console.log("stripping current-svg from icon");
                                //details.svg_data = details.svg_data.replace(' class="extension-floorplanner-current-svg"','');
                                //}
                                if (floorplanner_started) {
                                    //details.svg_data = details.svg_data.replace(' class="extension-floorplanner-current-svg"','');
                                }

                                floorplan_image_el.innerHTML = details.svg_data.replace(' class="extension-floorplanner-current-svg"', '');
                                floorplan_el.appendChild(floorplan_image_el);

                                let floorplan_name_el = document.createElement('span');
                                floorplan_name_el.classList.add('extension-floorplanner-floorplan-item-name');
                                floorplan_name_el.textContent = details.name;
                                floorplan_el.appendChild(floorplan_name_el);

                                if (load_whatever && typeof current_filename == 'string' && typeof floorplans[current_filename] != 'undefined') {
                                    load_whatever = false;
                                }
                                /*
                                if(load_whatever){
                                    if(current_filename != null){
                                        if(typeof floorplans[current_filename] != 'undefined'){

                                        }
                                    }
                                    //console.log("loadwhatever.  details.name: ", details.name);
                                    load_whatever = false;
                                    current_filename = details.name;
                                    //current_filename = floorplans[key].name;
                                    document.getElementById('extension-floorplanner-current-filename').textContent = current_filename;
                                    localStorage.setItem('extension-floorplanner-current-filename', JSON.stringify(current_filename));
                                    load_from_floorplans(details);
                                    unsaved = false;
                                }
                                */

                                //console.log("floorplanner_started: ", floorplanner_started);

                                if (floorplanner_started) {

                                    floorplan_el.addEventListener("mouseover", throttle(function(event) {
                                        if (manual_bg_upload == false && typeof floorplans[key].name == 'string') {
                                            if (floorplans[key].name != current_filename) {

                                                var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                                                var svgBlob = new Blob([preface, details.svg_data], {
                                                    type: "image/svg+xml;charset=utf-8"
                                                });
                                                var svgUrl = URL.createObjectURL(svgBlob);

                                                bg_image_el.style.backgroundImage = "url(" + svgUrl + ")";
                                                bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');
                                                setTimeout(() => {
                                                    bg_image_el.classList.add('extension-floorplanner-slow-fade-out');
                                                }, 1);
                                            } else {
                                                bg_image_el.style.backgroundImage = "none";
                                            }
                                        }
                                    }, 30));


                                    floorplan_el.addEventListener("click", () => {
                                        //console.log("floorplan icon clicked. key: ", key);
                                        //console.log("floorplans x: ", floorplans[key]);
                                        //console.log("current_filename: ", current_filename);
                                        //console.log("unsaved: ", unsaved);
                                        //var safe_to_save = false;

                                        //console.log("types: ", typeof floorplans[key].name, typeof floorplans[key].floorplan);
                                        if (typeof floorplans[key].name == 'string' && typeof floorplans[key].floorplan == 'string') {
                                            //console.log("types are both string, ok");
                                            if (floorplans[key].name != current_filename) {

                                                if (unsaved) {
                                                    //if(confirm("Should the changes you have made be saved first?")){
                                                    save_to_floorplans();
                                                    //}
                                                }
                                                //zoom_maker('zoomreset',0,0);
                                                //console.log("calling load_from_floorplans");
                                                load_from_floorplans(details);
                                                unsaved = false;
                                                //zoom_maker('zoomreset',0,0);
                                                //zoom_maker('zoomout', 1);
                                            } else {
                                                if (unsaved) {
                                                    if (confirm("Are you sure you want to revert to the old version of the floorplan? This will undo any changes you have made.")) {
                                                        load_from_floorplans(details);
                                                        unsaved = false;
                                                        //zoom_maker('zoomreset',0,0);
                                                        //zoom_maker('zoomout', 1);
                                                    }
                                                } else {
                                                    load_from_floorplans(details);
                                                    unsaved = false;
                                                    //zoom_maker('zoomreset',0,0);
                                                    //zoom_maker('zoomout', 1);
                                                }
                                            }
											get_all_things(); // update list of which things should currently be shown
											
                                        } else {
                                            console.error("missing attribute(s) in floorplan(s): ", floorplans[key], floorplans);
                                        }
                                        bg_image_el.style.backgroundImage = 'none';
                                        generate_floorplans_list();
                                    });

                                } else {
                                    floorplan_el.addEventListener("click", () => {

                                        if (current_filename == null) {
                                            localStorage.removeItem('extension-floorplanner-history');
                                        }

                                        if (typeof floorplans[key].name == 'string') {

                                            if (typeof current_filename == 'string' && current_filename != floorplans[key].name) {
                                                //console.log("clearing floorplanner history");
                                                localStorage.removeItem('extension-floorplanner-history');
                                            }
                                            //var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                                            //var svgBlob = new Blob([preface, details.svg_data], {type:"image/svg+xml;charset=utf-8"});
                                            //var svgUrl = URL.createObjectURL(svgBlob);

                                            //bg_image_el.style.backgroundImage = "url(" + svgUrl + ")";
                                            bg_image_el.innerHTML = details.svg_data;
                                            let bg_svg = bg_image_el.querySelector('svg');
                                            if (bg_svg) {
                                                //console.log("adding extension-floorplanner-current-svg to bg svg");
                                                //bg_svg.classList.add('extension-floorplanner-current-svg');
                                            }
                                            bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');

                                            current_filename = floorplans[key].name;
                                            document.getElementById('extension-floorplanner-current-filename').textContent = current_filename;
                                            localStorage.setItem('extension-floorplanner-current-filename', JSON.stringify(current_filename));

                                            zoom_maker('zoomreset', 0, 0);
                                            bg_image_el.style.backgroundImage = 'none';
                                            //generate_floorplans_list();
                                        }
										get_all_things();
                                        generate_floorplans_list();
                                    });

                                    //console.log("generate_floorplans_list: floorplans[key].name =?= current_filename: ", floorplans[key].name, current_filename);
                                    if (typeof floorplans[key].name == 'string' && typeof current_filename == 'string') {
                                        //console.log("both strings: ", floorplans[key].name, current_filename);
                                        if (floorplans[key].name == current_filename) {
                                            //console.log("NAMES MATCH. floorplan_el: ", floorplans[key].name, floorplan_el);
                                            //floorplan_el.classList.add('extension-floorplanner-floorplan-icon-current');
                                            //floorplan_el.style.backgroundColor='purple';
                                            //floorplan_name_el.classList.add('extension-floorplanner-floorplan-icon-current');

                                            //var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                                            //var svgBlob = new Blob([preface, details.svg_data], {type:"image/svg+xml;charset=utf-8"});
                                            //var svgUrl = URL.createObjectURL(svgBlob);

                                            //bg_image_el.style.backgroundImage = "url(" + svgUrl + ")";
                                            //console.log("details.svg_data: ", details.svg_data);

                                            bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');
                                            bg_image_el.innerHTML = details.svg_data;
                                            let bg_svg = bg_image_el.querySelector('svg');
                                            if (bg_svg) {
                                                //console.log("adding extension-floorplanner-current-svg to bg svg");
                                                bg_svg.classList.add('extension-floorplanner-current-svg');
                                            }
                                            //bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');

                                            document.getElementById('extension-floorplanner-current-filename').textContent = current_filename;
                                        }
                                    } else {
                                        console.error("generate_floorplans_list: could not compare filenames. current_filename: ", current_filename);
                                    }
                                }

                                floorplans_list_el.append(floorplan_el);


                            }
                        } else {
                            console.error("spotted floorplan without index");
                        }
                    }
                }
                slist(floorplans_list_el);
            }


            function slist(target) {
                target.classList.add("extension-floorplanner-slist");
                let items = target.getElementsByTagName("li"),
                    current = null;

                for (let i of items) {
                    i.draggable = true;

                    i.ondragstart = e => {
                        current = i;
                        for (let it of items) {
                            if (it != current) {
                                it.classList.add("extension-floorplanner-slist-hint");
                            }
                        }
                    };

                    i.ondragenter = e => {
                        if (i != current) {
                            i.classList.add("extension-floorplanner-slist-active");
                        }
                    };

                    i.ondragleave = () => i.classList.remove("extension-floorplanner-slist-active");

                    i.ondragend = () => {
                        //console.log("dragEnd");
                        var icon_index = 0;
                        for (let it of items) {
                            it.classList.remove("extension-floorplanner-slist-hint");
                            it.classList.remove("extension-floorplanner-slist-active");
                        }
                        update_floorplans_index();
                    };

                    i.ondragover = e => e.preventDefault();

                    i.ondrop = e => {
                        e.preventDefault();
                        if (i != current) {
                            let currentpos = 0,
                                droppedpos = 0;
                            for (let it = 0; it < items.length; it++) {
                                if (current == items[it]) {
                                    currentpos = it;
                                }
                                if (i == items[it]) {
                                    droppedpos = it;
                                }
                            }
                            if (currentpos < droppedpos) {
                                i.parentNode.insertBefore(current, i.nextSibling);
                            } else {
                                i.parentNode.insertBefore(current, i);
                            }
                        }
                    };
                }
            }


            function update_floorplans_index() {
                //console.log("in update_floorplans_index");
                let floorplans_icons_els = floorplans_list_el.getElementsByTagName("li");
                var icon_index = 0;
                for (let it of floorplans_icons_els) {
                    let floorplan_name = it.querySelector('.extension-floorplanner-floorplan-item-name').textContent;
                    if (floorplan_name) {
                        if (typeof floorplans[floorplan_name] != 'undefined') {
                            //console.log("setting floorplans index");
                            floorplans[floorplan_name].index = icon_index;
                        }
                    }
                    icon_index++;
                }
                localStorage.setItem('extension-floorplanner-floorplans', JSON.stringify(floorplans));
            }



            function load_from_floorplans(details) {
                //console.log("in load_from_floorplans. details: ", details.name, details);
                if (typeof details == 'object') {
                    clear_floorplan(true);
                    //zoom_maker('zoomreset',0,0);
                    //let moisturized = JSON.parse(details.floorplan);
                    //console.log("moisturized: ", moisturized );
                    HISTORY = [details.floorplan];
                    //console.log("history: ", HISTORY);
                    HISTORY.index = 1;
                    current_filename = details.name;
                    document.getElementById('extension-floorplanner-current-filename').textContent = details.name;
                    localStorage.setItem('extension-floorplanner-current-filename', JSON.stringify(current_filename));
                    //floorplanLoad(0);
                    //floorplanSave();

                    //localStorage.setItem('extension-floorplanner-history', JSON.stringify([moisturized]));
                    localStorage.setItem('extension-floorplanner-history', JSON.stringify([details.floorplan]));

					skip_first_save_to_floorplans = true;
                    floorplanLoad(0, "boot");
                    floorplanSave("boot");
                    //generate_object_list();
                }
            }


            function bye_binder() {
                //console.log("in bye_binder. binder: ", binder);
                //console.log("bye_binder: typeof binder: ", typeof binder);
                if (typeof(binder) != 'undefined') {
                    //console.log("bye_binder: typeof binder.remove: ", typeof binder.remove);

                    if (typeof binder.graph != 'undefined') {
                        //binder.graph.remove();
                    }
                    if (typeof binder.remove != 'undefined') {
                        binder.remove();
                    }

                    binder = (function() {
                        return;
                    })();

                }

                if (typeof(binder) != 'undefined') {
                    console.error("bye_binder: failed. binder still exists: ", binder);
                }
            }


            function clone_object() {
                if (objTarget != null && typeof objTarget.type == 'string' && typeof objTarget.params != 'undefined' && typeof objTarget.params.bindBox != 'undefined' && objTarget.params.bindBox == true) {

                    currently_cloning_an_object = true;
                    //console.log("in clone_object. objTarget, binder: ", objTarget,binder);

                    cursor('move');
                    box_info_el.innerHTML = 'Cloning an object: ' + objTarget.type;
                    //fonc_button('object_mode', objTarget.type);

                    if (typeof binder.obj != 'undefined') {
                        //console.log("cloner: binder.obj: ",  binder.obj);
                        //bye_binder();
                        //binder = binder.obj.cloneNode(true);
                        //const clone = structuredClone(binder.obj);
                        let path_copy = binder.graph.cloneNode(true);
                        //console.log("cloner: path_copy: ", path_copy)
                        const clone1 = JSON.parse(JSON.stringify(binder.obj)); //binder.obj.cloneNode(true);
                        //console.log("json clone1: ", clone1);

                        let load = true;
                        let obj = new floorplanEditor.obj2D(binder.obj.family, binder.obj.class, binder.obj.type, {
                            x: binder.obj.x + 50 + Math.floor(Math.random() * 20),
                            y: binder.obj.y + 50 + Math.floor(Math.random() * 20),
                        }, binder.obj.angle, binder.obj.angleSign, binder.obj.size, binder.obj.hinge = 'normal', binder.obj.thick, binder.obj.value, load); // true indicates this is a load, so to ignore the params size and thickness
                        obj.limit = binder.obj.limit;
                        //console.log("clone obj.limit? ", obj.limit);
                        OBJDATA.push(obj);


                        //let clone = Object.assign(Object.create(Object.getPrototypeOf(binder.obj)), binder.obj);
                        //clone.graph = path_copy;
                        //console.log("clone: ", clone);

                        //clone.x = clone.x + 30;
                        //clone.y = clone.y + 30;
                        //OBJDATA.push(clone);

                        if (obj.family == 'inWall') {
                            document.querySelector('#extension-floorplanner-boxcarpentry').append(OBJDATA[OBJDATA.length - 1].graph);
                        } else {
                            //document.querySelector('#extension-floorplanner-boxEnergy').append(OBJDATA[OBJDATA.length - 1].graph);
                            var targetBox = 'boxcarpentry';
                            if (OBJDATA[OBJDATA.length - 1].class == 'text') targetBox = 'boxText';
                            else if (OBJDATA[OBJDATA.length - 1].class == 'energy') targetBox = 'boxEnergy';
                            else if (OBJDATA[OBJDATA.length - 1].class == 'furniture') targetBox = 'boxFurniture';
                            else if (OBJDATA[OBJDATA.length - 1].class == 'measure') targetBox = 'boxMeasure';
                            document.querySelector('g#extension-floorplanner-' + targetBox).append(OBJDATA[OBJDATA.length - 1].graph);
                        }


                        obj.update();

                        //bye_binder();
                        //binder = clone;
                        //binder.graph = path_copy;
                        //console.log("extracted binder: ", binder);
                        //hideAllSize();
                        //binder.x = startCoords.x;
                        //binder.y = startCoords.y;
                        //binder.angle = angleWall;

                        mode = "select_mode";
                        //action = 0;

                        //mode = 'object_mode';
                        //modeOption = objTarget.type;

                        //binder.update();
                        //console.log("door mode: appending binder.graph: ", binder.graph);
                        //document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);




                    }
                    if (objTarget.params.move) {
                        //console.log("this objTarget.params.move is true, setting move cursor");
                        cursor('move');
                    }


                } else {
                    console.error("cannot clone: objTarget had no valid type/boundingbox. It cannot be cloned. objTarget: ", objTarget);
                }

            }


            function save_object() {
                currently_editing_an_object = false;
                currently_cloning_an_object = false;
                //console.log("in save_object");
                fonc_button('select_mode');
                box_info_el.innerHTML = ''; // Selection mode
                document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'none';
                panel_el.style.display = 'block';
                if (typeof binder != 'undefined' && typeof binder.graph != 'undefined') binder.graph.remove(); // superfluous..
                bye_binder();
                //floorplanner_debug();

            }


            // Settings
            function show_floorplanner_settings() {
                document.querySelector('#extension-floorplanner-settings').style.display = 'block';
                panel_el.style.display = 'none';
            }

            function close_floorplanner_settings() {
                document.querySelector('#extension-floorplanner-settings').style.display = 'none';
                panel_el.style.display = 'block';
            }

            document.getElementById('extension-floorplanner-auto-save-checkbox').addEventListener('change', () => {
                settings.auto_save = document.getElementById('extension-floorplanner-auto-save-checkbox').checked;
                save_floorplanner_settings();
            }, true);

            document.getElementById('extension-floorplanner-multi').addEventListener('change', () => {
                settings.multi_line = document.getElementById('extension-floorplanner-multi').checked;
                save_floorplanner_settings();
            }, true);
			
            document.getElementById('extension-floorplanner-dark-mode').addEventListener('change', () => {
                //console.log("dark mode checkbox toggled");
                settings.dark_mode = document.getElementById('extension-floorplanner-dark-mode').checked;
                if (settings.dark_mode) {
                    content_el.classList.add('extension-floorplanner-dark-mode');
                } else {
                    content_el.classList.remove('extension-floorplanner-dark-mode');
                }
                save_floorplanner_settings();
            }, true);


            function load_floorplanner_settings() {
				
				if(typeof settings.thing_icons_size != 'number'){
					console.warn("settings.thing_icons_size was not a number: ", settings.thing_icons_size);
					settings.thing_icons_size = 3;
				}
				
                document.getElementById('extension-floorplanner-auto-save-checkbox').checked = settings.auto_save;
                document.getElementById('extension-floorplanner-multi').checked = settings.multi_line;
				document.getElementById('extension-floorplanner-thing-icons-size').value = settings.thing_icons_size;
				
				set_thing_icon_scale(settings.thing_icons_size);
            }

            function save_floorplanner_settings() {
                localStorage.setItem('extension-floorplanner-settings', JSON.stringify(settings));
            }


            document.getElementById('extension-floorplanner-thing-icons-size').addEventListener("input", function(event) {
                //let sliderValue = this.value;
				settings.thing_icons_size = parseFloat(this.value);
				save_floorplanner_settings();
				set_thing_icon_scale(settings.thing_icons_size);
            });


			function set_thing_icon_scale(scale){
				//console.log("in set_thing_icon_scale. New scale: ", scale);
				if(typeof scale != 'number'){
					console.warn("set_thing_icon_scale: invalid input: ", scale);
					scale = 3;
				}
				let floorplan_el = document.getElementById('floorplan');
				floorplan_el.classList.remove.apply(floorplan_el.classList, Array.from(floorplan_el.classList).filter(v=>v.startsWith('extension-floorplanner-scale')));
				floorplan_el.classList.add('extension-floorplanner-scale' + scale);
				//console.log("floorplan_el.classList: ", floorplan_el.classList);
				
			}



            /*
            function get_object_icon(object_name){
                //console.log('in get_object_icon. object_name: ', object_name);
                let object_button_el = document.querySelector('#extension-floorplanner-energy_list #extension-floorplanner-' + object_name);
                if(object_button_el){
                    return object_button_el.textContent[0];
                }
                return '?';
            }
            */


            // If on Candle, get the image and send it to the backend to print on a network printer. Otherwise start normal print procedure.
            function print_floorplan() {

                if (document.body.classList.contains('cups-printing')) {
                    // send svg to Candle backend to print
                } else if (document.body.classList.contains('kiosk')) {
                    // heck, try to print? Or show a warning that printing is not possible from the kiosk?
                    //window.print();
                } else {
                    window.print();
                }
                //if( document.getElementById('main-menu') == null){}

            }


            function generate_object_list() {

                if (!document.body.classList.contains('developer')) {
                    return; // DISABLED FOR NOW
                }

                if (!floorplanner_started) {
                    return
                }
				
                let object_list_el = document.getElementById('extension-floorplanner-object_list');
                object_list_el.innerHTML = '';
                for (const [key, details] of Object.entries(OBJDATA)) {
                    //console.log(`generate_object_list: ${key}: ${details}`);
                    //console.log("generate_object_list: details: ", details);
                    if (typeof details.type == 'string') {
                        let object_el = document.createElement('div');
                        object_el.classList.add('extension-floorplanner-object-item');
                        /*
                        let object_image_el = document.createElement('img');
                        object_image_el.classList.add('extension-floorplanner-floorplan-item-icon');
                        object_image_el.src = details.svg_image_url;
                        object_image_el.alt = details.name + ' thumbnail image';
                        object_el.appendChild(object_image_el);
                        */
                        let object_image_el = document.createElement('div');
                        object_image_el.classList.add('extension-floorplanner-object-item-icon');

                        //object_image_el.innerHTML = details.svg_data;
                        //object_el.appendChild(object_image_el);

                        let object_name_el = document.createElement('span');
                        object_name_el.classList.add('extension-floorplanner-object-item-name');
                        let object_icon = '??'; //get_object_icon(details.type);

                        let object_button_el = document.querySelector('#extension-floorplanner-energy_list #extension-floorplanner-' + details.type);
                        if (object_button_el) {
                            //console.log("found the furniture button for ", details.type);

                            object_icon = object_button_el.textContent; //[0];
                            //console.log("object_icon: ", object_icon);
                            object_name_el.textContent = object_icon;
                            object_el.appendChild(object_name_el);

                            object_el.addEventListener("click", () => {
                                //console.log("object icon clicked. key,details: ", key, details);
                                root_el.classList.remove('extension-floorplanner-do-not-pulsate');

                                objTarget = details;
                                mode = 'bind_mode';
                                force_obj_edit(details);

                                //console.log('hacky binder: ', binder);
                                //console.log('hacky objTarget: ', objTarget);
                            });
                            if (object_icon != '??') {
                                object_list_el.appendChild(object_el);
                            }

                        } else {
                            //console.log("Warning, could not find the furniture button for: ", details.type);
                        }

                    }

                }
            }



            //let element = document.getElementById('extension-floorplanner-lin');
            let scale = 1.0;
            //let half_scale = 1.0;

            linElement.addEventListener("wheel", throttle(function(event) {
                _MOUSEWHEEL(event);
            }, 50));

            function _MOUSEWHEEL(ev) {
                // This is crucial. Without it, the browser will do a full page zoom
                ev.preventDefault();

                //console.log("ev.deltaY: ", ev.deltaY);

                // This is an empirically determined heuristic.
                // Unfortunately I don't know of any way to do this better.
                // Typical deltaY values from a trackpad pinch are under 1.0
                // Typical deltaY values from a mouse wheel are more than 100.
                const absolute_deltaY = Math.abs(ev.deltaY);
                let isPinch = absolute_deltaY < 50;

                //console.log("mousewheel deltaY: ", ev.deltaY);
                //console.log("zoom: ",zoom);
                if (absolute_deltaY < 10) {
                    if (ev.deltaY > 0) {
                        zoom_maker('zoomin', 20 * absolute_deltaY);
                    } else {
                        zoom_maker('zoomout', 20 * absolute_deltaY);
                    }
                } else {
                    if (ev.deltaY > 0) {
                        zoom_maker('zoomin', 200);
                    } else {
                        zoom_maker('zoomout', 200);
                    }
                }

            }

            //
            // Let's get this party started
            //



            function clear_selection() {
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }
            }


            function force_obj_edit(obj_target) {
                //console.log("in force_obj_edit. objTarget: ", objTarget);

                objTarget = obj_target;

                if (objTarget.params.bindBox) { // OBJ -> BOUNDINGBOX TOOL
                    bye_binder();
                    //console.warn("select_mode:  OBJTARGET HAS BINDBOX -> setting binder as obj2D boundingbox");
                    if (typeof(binder) == 'undefined') {
                        binder = new floorplanEditor.obj2D("free", "boundingBox", "", objTarget.bbox.origin, objTarget.angle, 0, objTarget.size * 0.5, "normal", objTarget.thick * 0.5, objTarget.realBbox);
                        binder.update();
                        binder.obj = objTarget;
                        binder.type = 'boundingBox';
                        binder.oldX = binder.x;
                        binder.oldY = binder.y;
                        document.querySelector('#extension-floorplanner-boxbind').append(binder.graph);
                        if (!objTarget.params.move) cursor('trash'); // LIKE MEASURE ON PLAN
                        if (objTarget.params.move) {
                            //console.log("this objTarget.params.move is true, setting move cursor");
                            cursor('move');
                        }
                    }

                    if (typeof(binder) != 'undefined' && binder.type == 'boundingBox') {
                        //var moveObj = Math.abs(binder.oldX - binder.x) + Math.abs(binder.oldY - binder.y);

                        objTarget = binder.obj;
                        /*
                              if (!objTarget.params.move) {
                          // TO REMOVE MEASURE ON PLAN
                          objTarget.graph.remove();
                          OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
                          box_info_el.innerHTML = 'Measurement deleted';
                        }
                              */
                        //if (moveObj < 1 && objTarget.params.move) {
                        if (!objTarget.params.resize) document.querySelector('#extension-floorplanner-objBoundingBoxScale').style.display = 'none';
                        else document.querySelector('#extension-floorplanner-objBoundingBoxScale').style.display = 'block';
                        if (!objTarget.params.rotate) document.querySelector('#extension-floorplanner-objBoundingBoxRotation').style.display = 'none';
                        else document.querySelector('#extension-floorplanner-objBoundingBoxRotation').style.display = 'block';
                        panel_el.style.display = 'none'
                        //console.log(objTarget.params.resizeLimit.width.min)
                        document.querySelector('#extension-floorplanner-objBoundingBox').style.display = 'block'
                        document.querySelector('#extension-floorplanner-lin').style.cursor = 'default';
                        box_info_el.innerHTML = ''; // Modify the object
                        //console.log(objTarget)
                        if (objTarget.params.resizeLimit) {
                            //console.log("object has resize limit: ", objTarget.params.resizeLimit);

                            document.getElementById('extension-floorplanner-bboxWidth').setAttribute('min', objTarget.params.resizeLimit.width.min);
                            document.getElementById('extension-floorplanner-bboxWidth').setAttribute('max', objTarget.params.resizeLimit.width.max);
                            //document.getElementById('extension-floorplanner-bboxWidthScale').textContent = objTarget.params.resizeLimit.width.min + "-" + objTarget.params.resizeLimit.height.max;
                            document.getElementById('extension-floorplanner-bboxWidthScale-min').textContent = objTarget.params.resizeLimit.width.min;
                            document.getElementById('extension-floorplanner-bboxWidthScale-max').textContent = objTarget.params.resizeLimit.width.max;
                            document.getElementById('extension-floorplanner-bboxHeight').setAttribute('min', objTarget.params.resizeLimit.height.min);
                            document.getElementById('extension-floorplanner-bboxHeight').setAttribute('max', objTarget.params.resizeLimit.height.max);
                            //document.getElementById('extension-floorplanner-bboxHeightScale').textContent = objTarget.params.resizeLimit.height.min + "-" + objTarget.params.resizeLimit.height.max;
                            document.getElementById('extension-floorplanner-bboxHeightScale-min').textContent = objTarget.params.resizeLimit.height.min;
                            document.getElementById('extension-floorplanner-bboxHeightScale-max').textContent = objTarget.params.resizeLimit.height.max;
                        }

                        document.querySelector('#extension-floorplanner-stepsCounter').style.display = 'none';
                        if (objTarget.class == 'stair') {
                            document.getElementById("extension-floorplanner-bboxStepsVal").textContent = objTarget.value;
                            document.querySelector('#extension-floorplanner-stepsCounter').style.display = 'block';
                        }
                        document.getElementById("extension-floorplanner-bboxWidth").value = objTarget.width * 100;
                        document.getElementById("extension-floorplanner-bboxWidthVal").textContent = objTarget.width * 100;
                        document.getElementById("extension-floorplanner-bboxHeight").value = objTarget.height * 100;
                        document.getElementById("extension-floorplanner-bboxHeightVal").textContent = objTarget.height * 100;
                        document.getElementById("extension-floorplanner-bboxRotation").value = objTarget.angle;
                        document.getElementById("extension-floorplanner-bboxRotationVal").textContent = objTarget.angle;
                        mode = 'edit_boundingBox_mode';
                        /*
			      }
			      else {
			                console.error("failed to force edit. objTarget: ", objTarget);
			        mode = "select_mode";
			        action = 0;
			        if(typeof binder.graph != 'undefined') binder.graph.remove();
			        //delete binder;
			                bye_binder();
			      }
			            */
                    }

                }
            }





            document.getElementById('extension-floorplanner-upload-background-image').addEventListener('change', readFileURL, true);

            function readFileURL() {
                var file = document.getElementById("extension-floorplanner-upload-background-image").files[0];
                var reader = new FileReader();
                reader.onloadend = function() {
                    manual_bg_upload = true;
                    bg_image_el.style.backgroundImage = "url(" + reader.result + ")";
                    bg_image_el.classList.remove('extension-floorplanner-slow-fade-out');
                    bg_image_el.style.opacity = '.3';
                }
                if (file) {
                    reader.readAsDataURL(file);
                } else {}
            }



			function makeSafeForCSS(unsafe_name) {
				if(typeof unsafe_name == 'string'){
					if(unsafe_name.startsWith('/things/')){
						unsafe_name = unsafe_name.replace('/things/','');
					}
					unsafe_name = unsafe_name.trim();
				    return unsafe_name.replace(/[^a-z0-9]/g, function(s) {
				        var c = s.charCodeAt(0);
				        if (c == 32) return '-';
				        if (c >= 65 && c <= 90) return '' + s.toLowerCase();
				        return '__' + ('000' + c.toString(16)).slice(-4);
				    });
				}
				else{
					console.error("makeSafeForCSS: invalid input: ", typeof unsafe_name, unsafe_name);
					return 'makeSafeForCSS-ERROR';
				}
			    
			}


			function get_all_things(){
				
				let things_list_container_el = document.getElementById('extension-floorplanner-things-list');
				things_list_container_el.innerHTML = '';
		        
				if(current_filename == null){
					things_list_container_el.innerHTML = '(No floorplan yet)';
				}
				else{	
					
			        let all_things = document.querySelectorAll('#floorplan .floorplan-thing');
					console.log("all_things: ", all_things);
					
					let css_filename = makeSafeForCSS(current_filename);
					console.log("current_filename -> css filename: ", current_filename, ' -> ',css_filename);
					
					// Remove old filename class if it exists, and set current floorplan css class
					floorplan_view_el.classList.remove.apply(floorplan_view_el.classList, Array.from(floorplan_view_el.classList).filter(v=>v.startsWith('extension-floorplanner-p-')));
					floorplan_view_el.classList.add('extension-floorplanner-p-' + css_filename);
					console.log("floorplan_view_el.classList: ", floorplan_view_el.classList);
					
					//let cleaned_things = {};
					let messy_things = {};
					for (let t = 0; t < all_things.length; t++) {
						let thing_href = all_things[t].getAttribute('data-href');
						//console.log("thing_href: ", thing_href);
						
						let thing_title = all_things[t].querySelector('.floorplan-thing-title').textContent;
						thing_title = thing_title.trim();
						//console.log("thing_title: -->" + thing_title + "<--");
						messy_things[thing_title] = thing_href;
					}
					
					//for (let t = 0; t < all_things.length; t++) {
					Object.keys(messy_things).sort().forEach(function(thing_title) {
						let thing_href = messy_things[thing_title];
						const css_name = 'extension-floorplanner-t-' + makeSafeForCSS(thing_href);
						//console.log("css_name: ", css_name);
					
						let thing_el = document.createElement('li');
						thing_el.setAttribute('data-href', thing_href);
						let thing_checkbox_el = document.createElement('input');
						thing_checkbox_el.type = 'checkbox';
						thing_checkbox_el.setAttribute('id',css_name);
						thing_checkbox_el.setAttribute('name',css_name);
						
						if(typeof visible_things[css_filename] != 'undefined'){
							if(typeof visible_things[css_filename][thing_href] != 'undefined' && typeof visible_things[css_filename][thing_href].visible != 'undefined'){
								thing_checkbox_el.checked = (visible_things[css_filename][thing_href].visible === true);
							}
						}
						
					
						let thing_label_el = document.createElement('label');
						thing_label_el.textContent = thing_title;
						thing_label_el.setAttribute('for',css_name);
					
						thing_checkbox_el.addEventListener('change', (event) => {
	                		console.log("checkbox changed: ", thing_checkbox_el.checked, thing_href, thing_title, css_name);
						
							if(current_filename != null){
								if(typeof visible_things[css_filename] == 'undefined'){
									visible_things[css_filename] = {};
								}
								visible_things[css_filename][thing_href] = {
									'href':thing_href,
									'title':thing_title,
									'visible':thing_checkbox_el.checked
								}
								localStorage.setItem('extension-floorplanner-visible-things', JSON.stringify(visible_things));
								update_thing_styles();
								
							}
						
	            		});
					
					
						thing_el.appendChild(thing_checkbox_el);
						thing_el.appendChild(thing_label_el);
						things_list_container_el.appendChild(thing_el);
						
					});
					
				}
				
				// data-href
				// floorplan-thing-title
				/*
		        window.API.getThings()
				.then((things) => {
		            console.log('floorplanner: API: things: ', things);
		        })
				.catch((err) => {
					console.error("floorplanner: error getting things list: ",err);
				});
      		  	*/
      
      		  	/*
		        API.getThing('energyuse').then((thing) => {
		            console.log('Theme:API: thing: ', thing);
		        });
      
      
      
      
		        API.getPlatform().then((platform) => {
		            console.log('Theme: API: platform: ', platform);
		        });
      		  	*/
      		    /*
		        try{
		            if(typeof window.API.getGroups === 'function') {
		                window.API.getGroups()
						.then((groups) => {
		                    console.log('floorplanner: groups: ', groups);
		                })
						.catch((err) => {
							console.error("floorplanner: error getting groups list: ", err);
						});
		            }
		        }
		        catch(e){
		            console.log("floorplanner: Api test error: ", e);
		        }
				*/
			}



			function update_thing_styles(){
				console.log("floorplanner: in update_thing_styles. visible_things: ", visible_things);
				let new_css = '';
				let counter = 0;
				if(current_filename != null){
					
					let thing_styles_el = document.getElementById('extension-floorplanner-thing-styles');
					
					for (const filename of Object.keys(visible_things)) {
						//console.log("floorplanner: generating css for filename: ", filename);
						
						let css_base = '.extension-floorplanner-p-' + filename + ' ';
						//console.log("css_base: ", css_base);
						
						new_css += css_base + '.floorplan-thing{display:none}\n\n';
						
						//extension-floorplanner-p-poitor div.floorplan-thing
						
						for (const [key, details] of Object.entries(visible_things[filename])) {
							let display = 'block';
							if(details.visible == false){
								display = 'none';
							}
							new_css += css_base + '.floorplan-thing[data-href="' + details.href + '"] {display:' + display + '!important}\n';
						}
						
					}
					
					//console.log("new_css: ",new_css);
					thing_styles_el.innerHTML = new_css;
				}
			}





            function start_floorplanner() {
                //console.log("STARTING FLOORPLANNER");
                floorplanner_started = true;
                localStorage.setItem('extension-floorplanner-currently-editing', JSON.stringify(true));

                //document.querySelector('#extension-floorplanner-recover').innerHTML = "<p>Select a plan type.</p>";

                hide_submenus();
                bg_image_el.innerHTML = '';
                generate_floorplans_list();
                root_el.classList.remove('extension-floorplanner-view-mode');
				floorplan_view_el.classList.add('extension-floorplanner-edit-mode');
                if (localStorage.getItem('extension-floorplanner-history')) {
                    setTimeout(() => {
                        initHistory('recovery');
                    }, 10);
                } else if (localStorage.getItem('extension-floorplanner-floorplans')) {
                    let temp_floorplans = JSON.parse(localStorage.getItem('extension-floorplanner-floorplans'));
                    //console.log("start_floorplanner: temp_floorplans: ", temp_floorplans);

                    if (typeof temp_floorplans == 'object' && temp_floorplans != null) {
                        floorplans = temp_floorplans;
                        const floorplans_length = Object.keys(temp_floorplans).length;
                        if (floorplans_length) {
                            //console.log("start_floorplanner: floorplans_length: ", floorplans_length);
                            //console.log("start_floorplanner: current_filename: ", current_filename);
                            if (current_filename != null && typeof floorplans[current_filename] != 'undefined') {
                                let details = floorplans[current_filename];

                                //console.log("start_floorplanner: current_filename details: ", details);
                                if (typeof details.name != 'undefined') {
                                    //current_filename = details.name;
                                    load_from_floorplans(details);
									
                                } else {
                                    console.error("details did not have name?: ", details);
                                    newFileModal.style.display = 'block';
                                }

                            }

                        } else {
                            console.warn("floorplans_length failed: ", floorplans_length);
                            newFileModal.style.display = 'block';
                        }
                    } else {
                        //console.log("temp_floorplans was not an object: ", temp_floorplans);
                        newFileModal.style.display = 'block';
                    }

                } else {
                    newFileModal.style.display = 'block';
                }
                bg_image_el.style.backgroundImage = "none";
				
				//get_all_things();
            }


            function stop_floorplanner(event) {
                floorplanner_started = false;
                localStorage.setItem('extension-floorplanner-currently-editing', false);

                if (Object.keys(floorplans).length == 0) {
                    save_to_floorplans();
                }

                if (Object.keys(floorplans).length > 0) {
                    //floorplanner_started = false;
                    hide_submenus();
                    clear_floorplan(true, false); // force clear, but don't reset the local storage
                    bg_image_el.style.backgroundImage = "none";
                    root_el.classList.add('extension-floorplanner-view-mode');
					floorplan_view_el.classList.remove('extension-floorplanner-edit-mode');
                    newFileModal.style.display = 'none';
                } else {
					event.preventDefault();
                    alert("Please create and save at least one floorplan");
                }
                //floorplanner_started = false;
                generate_floorplans_list(true);
                bg_image_el.style.opacity = '1';
            }



            function floorplanner_debug() {
                console.error("\n\nDEBUG:");
                console.log("HISTORY:", HISTORY);
                console.log("HISTORY.index: ", HISTORY.index);
                console.log("OBJDATA:", OBJDATA);
                console.log("WALLS:", WALLS);
                console.log("ROOM:", ROOM);
                if (typeof objTarget != undefined) {
                    console.log("objTarget:", objTarget);
                }
                console.log("binder:", binder);
                console.log("current_filename:", current_filename);
                console.log("floorplans:", floorplans);
                console.log("zoom level:", zoom);
                console.log("zoom factor:", factor);
            }



            //window.addEventListener("load", () => {
            //});

            function prepare_floorplanner_really() {
                //console.log("in window.addEventListener LOAD");
                //document.getElementById('extension-floorplanner-moveBox').style.transform = "translateX(-215px)";
				document.getElementById('extension-floorplanner-moveBox').style.transform = "translateX(-17rem)";
				
                /*
                setTimeout(()=>{
                    document.getElementById('extension-floorplanner-zoomBox').style.transform = "translateX(-165px)";
                },300);
                */
                setTimeout(() => {
                    //document.getElementById('extension-floorplanner-zoomBox2').style.transform = "translateX(-330px)";
					//document.getElementById('extension-floorplanner-zoomBox2').style.transform = "translateX(-20.5rem)";
					document.getElementById('extension-floorplanner-zoomBox2').style.transform = "translateX(-24rem)";
                }, 300);
                setTimeout(() => {
                    document.getElementById('extension-floorplanner-floorplans-list').style.transform = "translateX(-11rem)";
                }, 400);
                //console.log("window load:  currently_editing,current_filename: ", currently_editing,current_filename);

                if (currently_editing === true) {
                    //console.log("window load: starting floorplanner because was already editing");
                    start_floorplanner();
                } else if (Object.keys(floorplans).length == 0) {
                    //console.log("window load: starting floorplanner because there are no floorplans yet");
                    start_floorplanner();
                } else {
                    //console.log("what the hack is going on. currently_editing: ", typeof currently_editing, currently_editing);
                }

                generate_floorplans_list();
            }

            prepare_floorplanner_really();

			get_all_things();


            // Unicode lookup  https://symbl.cc/en/unicode/table/#arrows
            // Make SVG path relative https://svg-path.com/

        }







        // HELPER METHODS

        hasClass(ele, cls) {
            return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        addClass(ele, cls) {
            if (!this.hasClass(ele, cls)) ele.className += " " + cls;
        }

        removeClass(ele, cls) {
            if (this.hasClass(ele, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, ' ');
            }
        }



    }

    new Floorplanner();

})();