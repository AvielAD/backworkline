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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerrarTicket = exports.IniciarTicker = exports.GetTicketByUUID = exports.GetTickets = void 0;
const client_1 = require("@prisma/client");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient();
const GetTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    let tickets = [];
    try {
        //agregar ticket
        const categories = yield prisma.cat_ticket.findMany();
        const ticketsresponse = yield prisma.ticket.findMany({
            include: {
                cat_ticket: true,
            }
        });
        //calcular total consumido en servicios
        ticketsresponse.forEach((item, index) => {
            var _a, _b;
            tickets.push({
                id: item.id,
                fechainicio: (0, moment_timezone_1.default)(item.fechainicio).format(process.env.FORMAT_DATE),
                nombre: item.nombre,
                uuid: item.uuidsearch,
                category: {
                    id: (_a = item.cat_ticket) === null || _a === void 0 ? void 0 : _a.id,
                    nombre: (_b = item.cat_ticket) === null || _b === void 0 ? void 0 : _b.nombre
                },
            });
        });
        //agregar servicios
        return tickets;
    }
    catch (error) {
        console.log(error);
        return [];
    }
});
exports.GetTickets = GetTickets;
const GetTicketByUUID = (uuidSearch) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let serviceList = [];
    try {
        const categories = yield prisma.cat_ticket.findMany();
        const services = yield prisma.cat_servicios.findMany();
        const ticket = yield prisma.ticket.findFirst({
            where: {
                uuidsearch: uuidSearch
            },
            include: {
                servicio_ticket: true
            }
        });
        ticket === null || ticket === void 0 ? void 0 : ticket.servicio_ticket.forEach((item) => {
            var _a, _b, _c, _d;
            serviceList.push({
                id: item.idcatservicio,
                nombre: (_a = services.find(y => y.id == item.idcatservicio)) === null || _a === void 0 ? void 0 : _a.nombre,
                costo: parseFloat((_d = (_c = (_b = services.find(y => y.id == item.idcatservicio)) === null || _b === void 0 ? void 0 : _b.costo) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "0"),
                includepay: item.includepay
            });
        });
        const dateiniciostring = (0, moment_timezone_1.default)(ticket === null || ticket === void 0 ? void 0 : ticket.fechainicio).format(process.env.FORMAT_DATE);
        const datefinstring = (0, moment_timezone_1.default)(ticket === null || ticket === void 0 ? void 0 : ticket.fechafinal).format(process.env.FORMAT_DATE);
        //America/Mexico_City
        let ticketresponse = {
            id: ticket === null || ticket === void 0 ? void 0 : ticket.id,
            fechainicio: dateiniciostring.toString(),
            fechafinal: datefinstring.toString(),
            nombre: ticket === null || ticket === void 0 ? void 0 : ticket.nombre,
            uuid: uuidSearch,
            total: parseFloat((_b = (_a = ticket === null || ticket === void 0 ? void 0 : ticket.total) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "0"),
            category: {
                id: ticket === null || ticket === void 0 ? void 0 : ticket.idcatticket,
                nombre: (_c = categories.find(y => y.id == (ticket === null || ticket === void 0 ? void 0 : ticket.idcatticket))) === null || _c === void 0 ? void 0 : _c.nombre
            },
            servicios: serviceList
        };
        return ticketresponse;
    }
    catch (error) {
        return null;
    }
});
exports.GetTicketByUUID = GetTicketByUUID;
const IniciarTicker = (newTicket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newElement = yield prisma.ticket.create({
            data: {
                idcatticket: newTicket.idcatticket,
                nombre: newTicket.nombre
            }
        });
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.IniciarTicker = IniciarTicker;
const CerrarTicket = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    let costotiempo = 0;
    let costoservicios = 0;
    let serviceList = [];
    try {
        const services = yield prisma.cat_servicios.findMany();
        const ticket = yield prisma.ticket.findFirst({
            where: {
                uuidsearch: uuid
            },
            include: {
                cat_ticket: true,
                servicio_ticket: true
            }
        });
        ticket === null || ticket === void 0 ? void 0 : ticket.servicio_ticket.forEach((item) => {
            var _a, _b, _c, _d;
            serviceList.push({
                id: item.idcatservicio,
                nombre: (_a = services.find(y => y.id == item.idcatservicio)) === null || _a === void 0 ? void 0 : _a.nombre,
                costo: parseFloat((_d = (_c = (_b = services.find(y => y.id == item.idcatservicio)) === null || _b === void 0 ? void 0 : _b.costo) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "0"),
                includepay: item.includepay
            });
        });
        const fechaCierre = (0, moment_timezone_1.default)().toDate();
        //calcular costo tiempo
        if ((ticket === null || ticket === void 0 ? void 0 : ticket.fechainicio) != null)
            costotiempo = totalCostTime(ticket.fechainicio, fechaCierre, parseFloat((_f = (_e = (_d = ticket.cat_ticket) === null || _d === void 0 ? void 0 : _d.costohora) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "0"));
        if (serviceList.length > 0)
            costoservicios = totalCostServices(serviceList);
        //calcular costo servicios
        const cerrar = yield prisma.ticket.update({
            where: {
                id: parseInt((_g = ticket === null || ticket === void 0 ? void 0 : ticket.id.toString()) !== null && _g !== void 0 ? _g : "0")
            },
            data: {
                fechafinal: fechaCierre,
                total: costotiempo + costoservicios
            }
        });
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.CerrarTicket = CerrarTicket;
const totalCostServices = (services) => {
    let totalresponse = 0;
    services.forEach((item) => {
        if (item.includepay) {
            totalresponse += item.costo;
        }
    });
    return totalresponse;
};
const totalCostTime = (inicio, fin, costohora) => {
    let totalresponse = 0;
    const start = (0, moment_timezone_1.default)(inicio);
    const end = (0, moment_timezone_1.default)(fin);
    const tiempototalm = moment_timezone_1.default.duration(end.diff(start));
    const minutos = tiempototalm.asMinutes();
    if (minutos < 10)
        totalresponse = 0;
    else if (minutos > 240)
        totalresponse = costohora * 4;
    else if (minutos >= 10 && minutos <= 60)
        totalresponse = costohora;
    else if (minutos > 60 && minutos <= 240)
        totalresponse = costohora + ((costohora / minutos) * (minutos - 60));
    return parseFloat((Math.round(totalresponse * 100) / 100).toFixed(0));
};
