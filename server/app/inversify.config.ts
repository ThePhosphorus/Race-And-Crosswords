import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { Crosswords } from "./crosswords/crosswords";
import { Race } from "./race/race";
import { Lexical } from "./crosswords/lexical/lexical";
import { Grid } from "./crosswords/grid/grid";
import { GridGenerator } from "./crosswords/grid/grid-generator/grid-generator";
import { TrackSaver } from "./race/trackSaver/trackSaver";
import { Multiplayer } from "./crosswords/multiplayer/multiplayer";
import { SocketsManager } from "./crosswords/multiplayer/socketsManager";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Crosswords).to(Crosswords);
container.bind(Types.Race).to(Race);
container.bind(Types.Lexical).to(Lexical);
container.bind(Types.Grid).to(Grid);
container.bind(Types.GridGenerator).to(GridGenerator);
container.bind(Types.TrackSaver).to(TrackSaver);
container.bind(Types.Multiplayer).to(Multiplayer);
container.bind(Types.SocketsManager).to(SocketsManager).inSingletonScope();

export { container };
