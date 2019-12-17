import 'package:dio/dio.dart';

class Http {
  Dio _client;

  Http() {
    _client = Dio(BaseOptions(
      baseUrl: 'https://shaerif.herokuapp.com/',
    ));
  }

  Future<int> sendFile(Stream fileStream, String token, String filename) async {
    var result = await _client.post("file/$token/$filename", data: fileStream);

    return result.statusCode;
  }
}

var http = Http();
