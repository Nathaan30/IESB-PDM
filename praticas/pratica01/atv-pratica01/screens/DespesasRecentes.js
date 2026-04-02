import DespesaItem from "../components/despesa/DespesaItem";
import DespesaSaida from "../components/despesa/DespesaSaida";

function DespesaRecente() {
  function filtrarUltimos70Dias(despesas) {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    return despesas.filter((despesa) => {
      return despesa.data >= seteDiasAtras && despesa.data <= hoje;
    });
  }

  const DUMMY_EMPESAS = [
    {
      id: "1",
      descricao: "Conta de Luz",
      valor: 100.99,
      data: new Date(2026, 2, 26),
    },
    {
      id: "2",
      descricao: "Conta de Agua",
      valor: 40.99,
      data: new Date(2026, 2, 31),
    },
  ];

  return (
    <DespesaSaida
      despesas={filtrarUltimos70Dias(DUMMY_EMPESAS)}
      periodo={"Últimos 7 dias"}
    />
  );
}
export default DespesaRecente;
