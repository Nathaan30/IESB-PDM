import { StyleSheet, Text, ScrollView } from "react-native";

function MetasList(props) {

    return (
    <ScrollView>
        {props.array.map((meta, index) => <Text key={index}
        style={styles.item}>{meta}</Text>)}
    </ScrollView>
    );

};

export default MetasList;