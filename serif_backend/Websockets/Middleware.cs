using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace serif_backend.Websockets
{
    public class WebSocketsHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        private ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        public WebSocketsHandlerMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context, ShareFileHandler shareFileHandler)
        {
            if (!context.WebSockets.IsWebSocketRequest) context.Response.StatusCode = 400;
            else
            {
                var socket = await context.WebSockets.AcceptWebSocketAsync();

            }
        }
    }
}