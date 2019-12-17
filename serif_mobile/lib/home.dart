import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:path/path.dart' as path;
import 'package:qrcode_reader/qrcode_reader.dart';
import 'package:serif_mobile/ReceiveShareIntent.dart';
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

    _intentDataStreamSubscription = ReceiveShareIntent.getMediaStream().listen((file) => handleFileShare(file));
    // ReceiveSharingIntent.getInitialMedia().then(handleFileShare);
  }


  Future<void> handleFileShare(Map raw) async {
    final shareData = ShareIntentData.fromRaw(raw);

    if (shareData.path == null || shareData.path.isEmpty) return;

    final file = File(shareData.path);
    final filename = path.basename(file.path);

    if (!(await file.exists())) return;

    final qrCode = await QRCodeReader().scan();

    final contentStream = file.openRead();
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
