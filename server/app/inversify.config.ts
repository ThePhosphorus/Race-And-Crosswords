import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { Crosswords } from "./crosswords/crosswords";
import { Race } from "./race/race";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Crosswords).to(Crosswords);
container.bind(Types.Race).to(Race);

export { container };
