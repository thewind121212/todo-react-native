import { View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";


function ExampleSheet() {
    return (
      <ActionSheet>
        <View style={{ height: 500 }}>
          <Text>Hello World</Text>
        </View>
      </ActionSheet>
    );
  }
   
  export default ExampleSheet;