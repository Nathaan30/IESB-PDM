import {View} from 'react-native';
import DespesaSumario from "./DespesaSumario";
import DespesaLista from "./DespesaLista";

function DespesaSaida(despesas, perido) {

    return(
        <View>
            <DespesaSumario despesas={despesas} periodo={periodo}/>
            <DespesaLista despesas={despesas}/>
        </View>
    )

}

export default DespesaSaida;