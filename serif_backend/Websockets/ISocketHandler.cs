using System.Net.WebSockets;
using System.Threading.Tasks;

namespace serif_backend.Websockets
{
    public interface ISocketHandler
    {
        Task HandleConnection(WebSocket socket);
    }
}