import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:qrcode_reader/qrcode_reader.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  StreamSubscription _intentDataStreamSubscription;

  @override
  void initState() {
    super.initState();
    _intentDataStreamSubscription = ReceiveSharingIntent.getMediaStream().listen((files) {
      var file = File(files.first.path);
      if (!file.existsSync()) return;

      var contentStream = file.openRead();
      contentStream.listen((bytes) {
        print("Got bytes! " + bytes.length.toString());
      }, onDone: () {
        print("DONE!");
      });
    });
    ReceiveSharingIntent.getInitialMedia().then((files) {
      if (files == null) return;
      if (files.first == null) return;

      var file = File(files.first.path);
      if (!file.existsSync()) return;

      print("Shared files initial!");
      print("Length: " + files.length.toString());
    });

    QRCodeReader().scan().then((qrCode) {
      print("QR CODE: " + qrCode);
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
        child: Text('Hello'),
      ),
    );
  }
}
