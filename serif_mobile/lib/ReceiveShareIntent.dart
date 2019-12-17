import 'dart:async';

import 'package:flutter/services.dart';

const EVENT_CHANNEL_NAME = 'com.coreline.shaerif';

class ReceiveShareIntent {
  static EventChannel _stream;

  static Stream getMediaStream() {
    if (_stream == null) _stream = _getEventChannelStream();

    return _stream.receiveBroadcastStream();
  }

  static EventChannel _getEventChannelStream() {
    return EventChannel(EVENT_CHANNEL_NAME);
  }
}


class ShareIntentData {
  String title;
  String path;

  ShareIntentData({this.title, this.path});


  static ShareIntentData fromRaw(Map raw) {
    return ShareIntentData(
      path: raw["path"],
      title: raw["title"],
    );
  }
}
