export default  {
    connection: "connection",               // Default connection to server {}
    requestName: "requestName",             // When the server ask for the player Name. {client should send the name (string) with emit}
    createMatch: "createMatch",             // Client ask to create a match. {Client should send difficulty (Difficulty)}
    joinMatch: "joinMatch",                 // Client ask to join a match. {Client should send the name (string) of the host player to join}
    playerSelectTile: "playerSelectTile",   // When a player select a tile. {Client should send index of Tile (number) and direction (Orientation)}
                                            // When the server notify other players about a selected Tile. {Server should send the id(number) of the player
                                            // the id (number) of the tile, and the direction (Orientation)}
    getGrid: "getGrid",                     // The client can Ask for grid from the server. {}
                                            // The server send the grid to the client {Server should send a grid. (CrosswordGrid)}
    disconnect : "disconnect",              // When the client disconnect itself. {}
    getPlayers : "getPlayers",              // The client ask for the current players {}
                                            // The server send the list of current players {Server should send an array of players (Array<IPlayer>)}
    completedWord: "completedWord",         // Client send the newly completed word and receive a comfirmation of the points {Client send completed 
                                            // word (Word), Server sends the player who got the word (number) and the word}
}