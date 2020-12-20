app.factory('indexFactory', [() => {
    const connectSocket = (url, options) => {
        return new Promise((resolve, reject) => {
            const socket = io(url, options);

            socket.on('connect', () => {
                resolve(socket);
            });
            socket.on('coonect_error', () => {
                reject(new Error('connect_error'));
            });
        });
    };

    return{
        connectSocket
    }
}]);