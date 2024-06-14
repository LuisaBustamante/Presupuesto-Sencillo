import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [initialBudget, setInitialBudget] = useState('');
  const [expenseValue, setExpenseValue] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [editIndex, setEditIndex] = useState(-1); // Índice del gasto que se está editando, -1 si no hay ninguno
  const [excessBudget, setExcessBudget] = useState(0); // Presupuesto excedido

  //Función para manejar la adición de un nuevo gasto.
  const handleAddExpense = () => {
    // Se verifica si el valor y la descripción del gasto no están vacíos
    if (expenseValue === '' || expenseDescription === '' || initialBudget == '') {
      alert('Por favor ingrese un presupuesto inicial, valor y una descripción para el gasto.');
    } else {
      if (totalExpenses + parseInt(expenseValue) > initialBudget) {
        alert('La suma de los gastos supera el presupuesto inicial.');
        setExcessBudget(totalExpenses + parseInt(expenseValue) - initialBudget);
      }

      const newExpense = { value: expenseValue, description: expenseDescription };
      setExpenses([...expenses, newExpense]);
      setExpenseValue('');
      setExpenseDescription('');
      setRemainingBudget(remainingBudget - parseInt(expenseValue));
      setTotalExpenses(totalExpenses + parseInt(expenseValue));
    }
  };

  // Función para gestionar el guardado de cambios en un gasto editado
  const handleSaveEdit = (index) => {
    // Actualiza el gasto en el índice especificado
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { value: expenseValue, description: expenseDescription };
    setExpenses(updatedExpenses);

    // Calcula la diferencia entre el valor antiguo y el nuevo valor del gasto
    const oldExpenseValue = expenses[index].value;
    const newExpenseValue = expenseValue;
    const difference = parseInt(newExpenseValue) - parseInt(oldExpenseValue);

    // Actualiza los gastos totales y el presupuesto restante
    setTotalExpenses(totalExpenses + difference);
    setRemainingBudget(remainingBudget - difference);

    // Actualiza el presupuesto excedido
    setExcessBudget(totalExpenses > initialBudget ? totalExpenses - initialBudget : 0);

    // Restablecer variables de estado para editar
    setExpenseValue('');
    setExpenseDescription('');
    setEditIndex(-1);
  };

  // Función para gestionar la cancelación de la edición de un gasto.
  const handleCancelEdit = () => {
    // Restablecer variables de estado para editar
    setExpenseValue('');
    setExpenseDescription('');
    setEditIndex(-1);
  };

  // Función para gestionar la eliminación de un gasto.
  const handleDeleteExpense = (index) => {
    const deletedExpense = expenses[index];
    const updatedExpenses = expenses.filter((expense, i) => i !== index);
    setExpenses(updatedExpenses);
    setTotalExpenses(totalExpenses - parseInt(deletedExpense.value));
    setRemainingBudget(remainingBudget + parseInt(deletedExpense.value));

    // Actualiza el presupuesto excedido
    setExcessBudget(totalExpenses > initialBudget ? totalExpenses - initialBudget : 0);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const expenseToEdit = expenses[index];
    setExpenseValue(expenseToEdit.value);
    setExpenseDescription(expenseToEdit.description);
  };

  return (
    <div>
      <h1>Presupuesto de gastos</h1>
      <div className="container">
        <div>
          <h3>Presupuesto inicial: {initialBudget}</h3>
          <input type="number" placeholder="" value={initialBudget} onChange={(e) => setInitialBudget(e.target.value)}
            className="form-control mb-3" />
        </div>
        <div className="mb-3">
          <h3>Agregar gastos</h3>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label"> Valor gasto </label>
            <input type="number" placeholder="" value={expenseValue} onChange={(e) => setExpenseValue(e.target.value)}
              className="form-control mb-3" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label"> Descripción gasto </label>
            <input type="text" placeholder="" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} className="form-control mb-3" />
          </div>
        </div>
        <button onClick={handleAddExpense} className="btn btn-primary"> Añadir gastos </button>
      </div>
      <div className="containerTabla">
        <h3 className="mt-5">Gastos</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Valor del gasto</th>
              <th>Descripción del gasto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.value}</td>
                <td>{expense.description}</td>
                <td>
                  {editIndex === index ? (
                    <>
                      <button onClick={() => handleSaveEdit(index)} className="btn btn-success"> Save </button>
                      <button onClick={handleCancelEdit} className="btn btn-danger"> Cancel </button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(index)} className="btn btn-primary"> Edit </button>
                  )}
                  <button onClick={() => handleDeleteExpense(index)} className="btn btn-danger"> Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4>Gastos totales: {totalExpenses}</h4>
        {excessBudget > 0 && (
          <h4 style={{ color: 'red' }}>
            Presupuesto excedido: {excessBudget}
          </h4>
        )}
      </div>
    </div>
  );
}

export default App;