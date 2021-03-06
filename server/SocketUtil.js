/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * SocketUtil.js
 *
 * @author Naresh Bhatia
 */

/*jshint node:true es5:true */

var _ = require('underscore');

var _io;

exports.init = function(io) {
    'use strict';
    _io = io;
};

// Broadcast and event to all open sockets
exports.broadcast = function(event, message) {
    'use strict';

    var clients = _io.sockets.clients();
    _.each(clients, function(client) {
        client.emit(event, message);
    });
};