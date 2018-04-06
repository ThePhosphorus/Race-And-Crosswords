export default  {
    connection: "connection",               // default connection to server {}
    requestName: "requestName",             // when the server ask for the player Name. {client should send the name (string) with emit}
    createMatch: "createMatch",             // client ask to create a match. {Client should send difficulty (Difficulty)}
    joinMatch: "joinMatch",                 // client ask to join a match. {Client should send the name (string) of the host player to join}
    playerSelectTile: "playerSelectTile",   // when a player select a tile. {Client should send index of Tile (number) and direction
                                            // (Orientation)} when the server notify other players about a selected Tile.
                                            // {Server should send the id(number) of the player
                                            // the id (number) of the tile, and the direction (Orientation)}
    getGrid: "getGrid",                     // the client can Ask for grid from the server. {}
                                            // the server send the grid to the client {Server should send a grid. (CrosswordGrid)}
    disconnect : "disconnect",              // when the client disconnect itself. {}
    getPlayers : "getPlayers",              // the client ask for the current players {}
                                            // the server send the list of current players {Server should send an array of players
                                            // (Array<IPlayer>)}
    completedWord: "completedWord",         // client send the newly completed word and receive a comfirmation of the points
                                            // {Client send completed word (Word), Server sends the player who got the word
                                            // (number) and the word}
    rematch: "rematch"                      // restart a multiplayer match with the same settings (resetting scores)
};