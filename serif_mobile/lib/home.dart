import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:path/path.dart' as path;
import 'package:qrcode_reader/qrcode_reader.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:serif_mobile/http.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  StreamSubscription _intentDataStreamSubscription;
  String _url;

  @override
  void initState() {
    super.initState();

    _intentDataStreamSubscription = ReceiveSharingIntent.getMediaStream().listen(handleFileShare);
    ReceiveSharingIntent.getInitialMedia().then(handleFileShare);
  }

  Future<void> handleFileShare(List<SharedMediaFile> files) async {
    if (files == null) return;
    if (files.first == null) return;

    var file = File(files.first.path);
    var filename = path.basename(file.path);

    if (!(await file.exists())) return;

    var contentStream = file.openRead();

    var qrCode = await QRCodeReader().scan();
    await http.sendFile(contentStream, qrCode, filename);

    setState(() {
      _url = "https://shaerif.herokuapp.com/file/$qrCode/$filename";
    });
  }

  @override
  void dispose() {
    _intentDataStreamSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: _url == null || _url.isEmpty
          ? Text('Hello, share a file into this app to upload it!')
          : Center(
              child: Wrap(
              children: [
                Text('Uploaded! Go to '),
                Text(_url, style: TextStyle(fontWeight: FontWeight.bold)),
                Text(' To download your file.')
              ],
            )),
    ));
  }
}
