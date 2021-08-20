import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export default async (isBg) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if(permissionResult.granted == true) {
        try {
            let pickResult = await ImagePicker.launchImageLibraryAsync()

            const ratio = pickResult.width / pickResult.height

            if(!pickResult.cancelled) {
                const resizePick = await ImageManipulator.manipulateAsync(
                    `${pickResult.uri}`,
                    [{resize: isBg ? {width: 960, height: 960 / ratio} : {width: 640, height: 640 / ratio}}],
                    { compress: 0.55, format: 'jpeg', base64: true}
                )
                
                return resizePick.base64
            }
        } catch (e) {}
    }

    return null
}