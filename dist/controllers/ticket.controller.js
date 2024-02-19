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
exports.AddServiceToTicket = exports.CerrarTicket = exports.IniciarTicket = exports.GetTicketById = exports.GetTickets = void 0;
const CtrlService = __importStar(require("../libs/services/tickets.service"));
const GetTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield CtrlService.GetTickets();
        return res.status(200).json(tickets);
    }
    catch (error) {
        return res.status(404).json([]);
    }
});
exports.GetTickets = GetTickets;
const GetTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuidSearch = (_a = String(req.params["uuidSearch"])) !== null && _a !== void 0 ? _a : "";
    try {
        const ticket = yield CtrlService.GetTicketByUUID(uuidSearch);
        return res.status(200).json(ticket);
    }
    catch (error) {
        return res.status(404).json([]);
    }
});
exports.GetTicketById = GetTicketById;
const IniciarTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newTicket = req.body;
    try {
        const response = yield CtrlService.IniciarTicket(newTicket);
        if (response.succeeded)
            return res.status(200).json(response);
        else
            return res.status(404).json(response);
    }
    catch (error) {
        return res.status(404).json([]);
    }
});
exports.IniciarTicket = IniciarTicket;
const CerrarTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const uuid = (_b = String(req.params["uuidSearch"])) !== null && _b !== void 0 ? _b : "";
    try {
        const response = yield CtrlService.CerrarTicket(uuid);
        if (response.succeeded)
            return res.status(200).json(response);
        else
            return res.status(404).json(response);
    }
    catch (error) {
        return res.status(404).json([]);
    }
});
exports.CerrarTicket = CerrarTicket;
const AddServiceToTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const uuidSearch = (_c = String(req.params["uuidSearch"])) !== null && _c !== void 0 ? _c : "";
    try {
    }
    catch (error) {
        return res.status(404).json([]);
    }
});
exports.AddServiceToTicket = AddServiceToTicket;
