app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

  $scope.messages = [ ];
  $scope.players= { };

  $scope.init = () => {
    const username = prompt('Please enter username');

    if(username)
      initSocket(username);
    else
      return false;
  };

  function initSocket(username){
    const connectionOptions = {
      reconnectionAttempts: 3,
      reconnectionDelay: 600
    };
   
    indexFactory.connectSocket('http://localhost:3000', connectionOptions)
      .then((socket) => {
        socket.emit('new user', {username});
               
        socket.on('initPlayers', (players) => {
          $scope.players = players;
          $scope.$apply();
        });

        socket.on('new user', (data) => {
          const messageData = {
            type: { // info
              code: 0,  //server or user message
              message: 1  // login or disconnect message
            }, 
            username: data.username
          };

          $scope.messages.push(messageData);
          $scope.players[data.id] = data;
          $scope.$apply();
        });

        socket.on('disUser', (data) => {
          const messageData = {
            type: { // info
              code: 0,  //server or user message
              message: 0  // login or disconnect message
            }, 
            username: data.username
          };

          $scope.messages.push(messageData);
          delete $scope.player[data.id];
          $scope.$apply();
        });

        let animate=false;
        $scope.onClickPlayer = ($event) => {
          console.log($event.offsetX,$event.offsetY);
          if(!animate){
            animate=true;
            $('#'+socket.id).animate({ 'left': $event.offsetX, 'top':$event.offsetY }, () => {
              animate=false;
            });
          }
        };

      }).catch((err) => {
        console.log(err);
      });
  }

}]);