"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEvent = void 0;
var amqp = require('amqplib');
function sendMessage() {
    return __awaiter(this, void 0, void 0, function () {
        var connection_1, channel_1, channel_2_1, queue, queue_2, message, message2, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, amqp.connect('amqps://qtqvqnvz:GwI-cQ4Y7VMeu9YOKHkCa6exDZ5S9WYY@moose.rmq.cloudamqp.com/qtqvqnvz')];
                case 1:
                    connection_1 = _a.sent();
                    return [4 /*yield*/, connection_1.createChannel()];
                case 2:
                    channel_1 = _a.sent();
                    return [4 /*yield*/, connection_1.createChannel()];
                case 3:
                    channel_2_1 = _a.sent();
                    queue = 'product';
                    queue_2 = 'pproducto2';
                    message = 'Nuevo producto disponible: Camisa';
                    message2 = 'Nuevo producto disponible: Zapatos';
                    // Declarar las colas
                    return [4 /*yield*/, channel_1.assertQueue(queue, { durable: false })];
                case 4:
                    // Declarar las colas
                    _a.sent();
                    return [4 /*yield*/, channel_1.assertQueue(queue_2, { durable: false })];
                case 5:
                    _a.sent();
                    // Suscribirse a la cola 'product' en channel_2
                    return [4 /*yield*/, channel_2_1.consume(queue, function (message) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!message) return [3 /*break*/, 2];
                                        return [4 /*yield*/, recibirMensaje(message)];
                                    case 1:
                                        _a.sent();
                                        channel_2_1.ack(message); // Reconocer en el mismo canal
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    // Suscribirse a la cola 'product' en channel_2
                    _a.sent();
                    // Suscribirse a la cola 'pproducto2' en channel_2
                    return [4 /*yield*/, channel_2_1.consume(queue_2, function (message) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!message) return [3 /*break*/, 2];
                                        return [4 /*yield*/, recibirMensaje2(message)];
                                    case 1:
                                        _a.sent();
                                        channel_2_1.ack(message); // Reconocer en el mismo canal
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 7:
                    // Suscribirse a la cola 'pproducto2' en channel_2
                    _a.sent();
                    console.log("Se suscribió");
                    // Enviar mensajes a las colas
                    channel_1.sendToQueue(queue, Buffer.from(message));
                    channel_1.sendToQueue(queue_2, Buffer.from(message2));
                    console.log("Mensaje enviado a la cola: ".concat(message));
                    console.log("Mensaje enviado a la cola: ".concat(message2));
                    // Cerrar los canales y la conexión después de un breve retraso
                    setTimeout(function () {
                        channel_1.close();
                        channel_2_1.close();
                        connection_1.close();
                    }, 500);
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function recibirMensaje(msg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Mensaje recibido:", msg.content.toString());
            return [2 /*return*/];
        });
    });
}
function recibirMensaje2(msg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Mensaje 2 recibido:", msg.content.toString());
            return [2 /*return*/];
        });
    });
}
sendMessage();
var testEvent = /** @class */ (function () {
    function testEvent(params) {
        this.msg = params;
        this.fecha = new Date();
    }
    testEvent.prototype.toJson = function () {
        return JSON.stringify(this);
    };
    return testEvent;
}());
exports.testEvent = testEvent;
var evento = new testEvent("HOLA");
console.log(evento.toJson());
console.log(Buffer.from(JSON.stringify(evento)));
var mensaje = Buffer.from(JSON.stringify(evento));
console.log(mensaje.toString());
