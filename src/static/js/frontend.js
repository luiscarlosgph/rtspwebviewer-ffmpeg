// ========= Initialize Base Variables ===========================
var janus = null;
var streaming = null;

var streamsList = {};
var selectedStream = null;

var opaqueId = "stream-" + Janus.randomString(12);


// ========= Define JanusServer URL ===========================
var server = null;

if (window.location.protocol === "http:") {
	server = "http://" + window.location.hostname + ":8088/janus";
}
else {
	server = "https://" + window.location.hostname + ":8089/janus";
}


// ========= Core Code ===========================
$(document).ready(function() {

    // Initialize JanusServer Library
	Janus.init({debug: "none", callback: function() {

        // Check if Client has WebRTC Support
		if (!Janus.isWebrtcSupported()) {
			Janus.error("Client has no support for WebRTC");
			return;
		}

        // Create new Session
		janus = new Janus({
            server: server,
            success: function() {

                // Connect to JanusServer Streaming Plugin
                janus.attach({
                    plugin: "janus.plugin.streaming",
					opaqueId: opaqueId,
                    success: function(pluginHandle) {
						streaming = pluginHandle;
						Janus.log("Plugin attached: [" + streaming.getPlugin() + ", id=" + streaming.getId() + "]");
						updateStreamsList();
					},
                    error: function(error) {
						Janus.error("A error occurred while attaching plugin: ", error);
					},
					iceState: function(state) {
						Janus.log("ICE state changed to: ", state);
					},
					webrtcState: function(state) {
						Janus.log("WebRTC PeerConnection is " + (state ? "online" : "offline") + " now");
					},
					slowLink: function(uplink, lost, mid) {
						Janus.warn("JanusServer reports problems " + (uplink ? "sending" : "receiving") + " packets on mid " + mid + " (" + lost + " lost packets)");
					},
                    onmessage: function(msg, jsep) {
                        Janus.log("Received message");
                        Janus.log(msg);

                        // Evaluate result
						var result = msg["result"];
                        if (result) {
							if (result["status"]) {
								if (result["status"] === "stopped") {
									stopStream();
								}
							}
                        }
                        else if (msg["error"]) {
                            Janus.error(msg["error"]);
							stopStream();
							return;
                        }

                        // JSEP Handling
                        if (jsep) {
                            Janus.log("Handling additional SDP");
                            Janus.log(jsep);

							var stereo = (jsep.sdp.indexOf("stereo=1") !== -1);

							// Create answer back to plugin
							streaming.createAnswer({
								jsep: jsep,
								media: {audioSend: false, videoSend: false, data: true},
								customizeSdp: function(jsep) {
									if (stereo && jsep.sdp.indexOf("stereo=1") == -1) {
										jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
									}
								},
								success: function(jsep) {
                                    Janus.log("SDP established");
                                    Janus.log(jsep);

									var body = {request: "start"};
									streaming.send({message: body, jsep: jsep});
								},
								error: function(error) {
									Janus.error("A error occurred while attempting to create JSEP Answer");
									Janus.error(error);
								}
							});
                        }
                    },
					onremotetrack: function(track, mid, on) {
						Janus.log("Remote track (mediaId=" + mid + ") " + (on ? "added" : "removed") + ":", track);

						// Retrieve track from JanusServer and rewrap to MediaStream
						var stream = new MediaStream();
						stream.addTrack(track.clone());
						Janus.log("Created remote video stream: ", stream);

						// Connect MediaStream to HTML Video DOM Element + Start Playback
						Janus.attachMediaStream($(".wrapper .stream").get(0), stream);
						$(".wrapper .stream").get(0).volume = 0;
						$(".wrapper .stream").get(0).play();
					}
                });
            },
            error: function(error) {
                Janus.error("A error occurred while attempting to create a new session. Reloading now.");
                Janus.error("Error: ", error);
                setTimeout(function(){ window.location.reload(); }, 3000);
			},
            destroyed: function() {
				Janus.error("The session has been destroyed. Reloading now.");
                setTimeout(function(){ window.location.reload(); }, 3000);
			}
        });
    }});
});


// ========= Retrieve list from JanusServer with all available streams ===========================
function updateStreamsList() {
	var body = {request: "list"};
	Janus.log("Sending message to JanusServer: ", body);

	streaming.send({
		message: body,
		success: function(result) {

			// No Streams are available
			if (!result) {
				Janus.warn("No streams available");
				return;
			}

			// Streams are available
			if (result["list"]) {
				var list = result["list"];

				// Sort stream list
				if (list && Array.isArray(list)) {
					list.sort(function(a, b) {
						if (!a || a.id < (b ? b.id : 0)) {return -1;}
						if (!b || b.id < (a ? a.id : 0)) {return 1;}
						return 0;
					});
				}

				Janus.log("Retrieved list of available streams: ", list);
				streamsList = {};

				// Transfer list array entrys to streamsList object
				for (var mp in list) {
					streamsList[list[mp]["id"]] = list[mp];
				}

				// Select first stream in available streams list and initiate streaming
				selectedStream = streamsList[Object.keys(streamsList)[0]].id;
				startStream();
			}
		}
	});
}


// ========= Start Stream ===========================
function startStream() {
	Janus.log("Selected stream id #" + selectedStream);

	// Get mid (mediaId) of Stream
	var mediaId = null;
	for (mediaIndex in streamsList[selectedStream].media) {
		var type = streamsList[selectedStream].media[mediaIndex].type;
		if (type === "video") {mediaId = streamsList[selectedStream].media[mediaIndex].mid; break;}
	}

	// Send state back to Janus Server
	var body = {request: "watch", id: parseInt(selectedStream) || selectedStream};
	Janus.log("Sending message to JanusServer: ", body);
	
	streaming.send({message: body});
}


// ========= Stop Stream ===========================
function stopStream() {
	var body = {request: "stop"};
	Janus.log("Sending message to JanusServer: ", body);

	streaming.send({message: body});
	streaming.hangup();
}