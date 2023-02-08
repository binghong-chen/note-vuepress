# Flutter IOS IPHONEOS_DEPLOYMENT_TARGET错误

![image-20221228184834750](./assets/image-20221228184834750.png)

```sh
cd ios
rm -rf Pods
rm Podfile.lock
rm -rf Runner.xcworkspace
pod install
pod update
cd ..
flutter clean
flutter run
```

