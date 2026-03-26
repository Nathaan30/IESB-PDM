import DespesaSaida from "../components/despesa/DespesaSaida"

function TodasDespesas(){

    const DUMMY_EMPESAS = [
        {
            id: '1',
            descricao: 'Conta de Luz',
            valor: 100.99,
            data: new Date(2025, 2, 11)
        },  
        {
            id: '2',
            descricao: 'Conta de Agua',
            valor: 40.99,
            data: new Date(2025, 4, 10)
        }
    ]

    return (
        <DespesaSaida despesas={DUMMY_EMPESAS} periodo={'Total'} />
    )

}

export default TodasDespesas