//
//  ShareViewController.swift
//  ShareifShare
//
//  Created by Josip Maric on 28/12/2019.
//  Copyright © 2019 Josip Maric. All rights reserved.
//

import UIKit
import Social
import MobileCoreServices

class ShareViewController: SLComposeServiceViewController {

    override func isContentValid() -> Bool {
        return true
    }
    
    func loadItem(fromItemProvider itemProvider: NSItemProvider, forType type: String) {
        itemProvider.loadItem(forTypeIdentifier: type, options: nil) { (secureCodedData, error) in
            if let url = secureCodedData as? URL, error == nil {
                if let data = try? Data(contentsOf: url) {
                    let defaults = UserDefaults(suiteName: "group.jmaric.Shareif.ShareifShare")
                    defaults?.set(data, forKey: "data")
                    
                    if let customURL = URL(string: "ShareifUrlScheme://"), UIApplication.shared.canOpenURL(customURL) {
                        UIApplication.shared.open(customURL, options: [UIApplication.OpenExternalURLOptionsKey(rawValue: "item") : "test"], completionHandler: nil)
                    }
                }
            }
            self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
        }
    }

    override func didSelectPost() {
        
        let supportedTypes: [String] = [kUTTypeImage as String, kUTTypePDF as String, kUTTypeAudiovisualContent as String, kUTTypeMovie as String, kUTTypeVideo as String, kUTTypeAudio as String, kUTTypeQuickTimeMovie as String, kUTTypeMPEG as String, kUTTypeMPEG2Video as String, kUTTypeMPEG2TransportStream as String, kUTTypeMP3 as String, kUTTypeMPEG4 as String, kUTTypeMPEG4Audio as String, kUTTypeAppleProtectedMPEG4Audio as String, kUTTypeAppleProtectedMPEG4Video as String, kUTTypeAVIMovie as String, kUTTypeAudioInterchangeFileFormat as String]
        
        if
            let obj = extensionContext?.inputItems.first as? NSExtensionItem,
            let itemProvider = obj.attachments?.first {
                for type in supportedTypes {
                    if itemProvider.hasItemConformingToTypeIdentifier(type) {
                        loadItem(fromItemProvider: itemProvider, forType: type)
                        break
                    }
                }
        } else {
            self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
        }
    }

    override func configurationItems() -> [Any]! {
        return []
    }

}
