"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerrarTicket = exports.IniciarTicket = exports.GetTicketByUUID = exports.GetTickets = void 0;
const CtrlRepository = __importStar(require("../repositories/tickets.repository"));
const GetTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    let tickets = yield CtrlRepository.GetTickets();
    return tickets;
});
exports.GetTickets = GetTickets;
const GetTicketByUUID = (uuidSearch) => __awaiter(void 0, void 0, void 0, function* () {
    let ticket = yield CtrlRepository.GetTicketByUUID(uuidSearch);
    return ticket;
});
exports.GetTicketByUUID = GetTicketByUUID;
const IniciarTicket = (newTicket) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield CtrlRepository.IniciarTicker(newTicket);
    if (response) {
        return {
            succeeded: true,
            message: "Ticket Iniciado Correctamente"
        };
    }
    else {
        return {
            succeeded: false,
            message: "Se ha presentado un problema al iniciar el ticket"
        };
    }
});
exports.IniciarTicket = IniciarTicket;
const CerrarTicket = (uuidSearch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield CtrlRepository.CerrarTicket(uuidSearch);
    if (response) {
        return {
            succeeded: true,
            message: "Ticket Cerrado Correctamente"
        };
    }
    else {
        return {
            succeeded: false,
            message: "Se ha presentado un problema al cerrar el ticket"
        };
    }
});
exports.CerrarTicket = CerrarTicket;
