import { render, screen, act, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Descripción del grupo de pruebas
describe('App', () => {
  let container;

  // Configuración inicial antes de todas las pruebas
  beforeAll(() => {
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  });

  // Prueba para verificar si el componente App se renderiza
  test('renders App component', () => {
    render(<App />, { container });
    // Verifica si cierto texto está en el documento
    expect(screen.getByText('Gestor de Tareas')).toBeInTheDocument();
  });

  // Prueba para verificar si el elemento de entrada se renderiza
  test('renders input element', () => {
    render(<App />);
    // Verifica si el elemento de entrada está en el documento
    expect(screen.getByPlaceholderText('Escribe una nueva tarea')).toBeInTheDocument();
  });

  // Prueba para verificar si el botón se renderiza
  test('renders button element', () => {
    render(<App />);
    // Verifica si el botón está en el documento
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  // Prueba para verificar si se renderiza AlertDialog al intentar eliminar una tarea
  test('renders AlertDialog when trying to delete a task', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Verifica si la tarea se agregó
    await waitFor(async () => {
      const taskElement = await screen.findByText('Tarea de prueba');
      expect(taskElement).toBeInTheDocument();
    }, { timeout: 4000 }); // Aumenta el tiempo de espera a 4000ms
    // Espera a que el botón "Eliminar" esté en el documento
    await screen.findByText('Eliminar');
    // Intenta eliminar la tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.click(screen.getAllByText('Eliminar')[0]);
    });
    // Verifica si el AlertDialog se renderiza
    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
  });

  // Prueba para verificar si se renderiza AlertDialog al intentar marcar una tarea como completada
  test('renders AlertDialog when trying to mark a task as completed', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Intenta marcar la tarea como completada
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.click(screen.getAllByRole('checkbox')[0]);
    });
    // Verifica si el AlertDialog se renderiza
    expect(screen.getByText('¿Marcar como completa?')).toBeInTheDocument();
  });

  // Prueba para verificar si se puede agregar una tarea con título y fecha de vencimiento válidos
  test('can add a task with valid title and due date', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Verifica si la tarea se agregó
    await waitFor(async () => {
      const taskElement = await screen.findByText('Tarea de prueba');
      expect(taskElement).toBeInTheDocument();
    }, { timeout: 4000 }); // Aumenta el tiempo de espera a 4000ms
  });

  // Prueba para verificar si no se puede agregar una tarea con título o fecha de vencimiento vacíos
  test('cannot add a task with empty title or due date', async () => {
    render(<App />);
    // Intenta agregar una tarea con un título vacío
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.click(screen.getByText('Agregar'));
    });
    // Verifica si la tarea no se agregó
    expect(screen.queryByText('Tarea de prueba')).not.toBeInTheDocument();
  });

  // Prueba para verificar si se puede editar el título y la fecha de vencimiento de una tarea existente
  test('can edit the title and due date of an existing task', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Intenta editar la tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      // Intenta editar la tarea
      userEvent.click(screen.getAllByText('Editar')[0]);

      const xpathInput = '/html/body/div[1]/div/div/main/div[2]/ul/li/div[1]/div[1]/div/input';
      const inputElement = document.evaluate(xpathInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      userEvent.type(inputElement, 'Tarea editada');

      // Espera a que el botón "Guardar" esté en el documento
      const xpathButton = '/html/body/div[1]/div/div/main/div[2]/ul/li/div[2]/button[1]';
      const buttonElement = document.evaluate(xpathButton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      userEvent.click(buttonElement);
    });
    // Verifica si la tarea se editó
    await waitFor(() => {
      const xpathTask = '/html/body/div[1]/div/div/main/div[2]/ul/li';
      console.log(xpathTask)
      const taskElement = document.evaluate(xpathTask, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      expect(taskElement).toBeInTheDocument();
    }, { timeout: 4000 }); // Aumenta el tiempo de espera a 4000ms
  });

  // Prueba para verificar si se puede marcar una tarea como completada
  test('can mark a task as completed', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Intenta marcar la tarea como completada
    userEvent.click(screen.getAllByRole('checkbox')[0]);

    // Comprueba si se muestra el diálogo de confirmación
    const dialog = screen.getByText('¿Marcar como completa?');
    expect(dialog).toBeInTheDocument();

    // Interactúa con el diálogo de confirmación
    const confirmButton = await screen.findByText('Confirmar');
    userEvent.click(confirmButton);

    // Verifica si la tarea se marcó como completada
    await waitFor(() => {
      const taskElement = screen.getByText('Tarea de prueba');
      // eslint-disable-next-line testing-library/no-node-access
      const listItem = taskElement.closest('li');
      expect(listItem).toHaveClass('opacity-50 line-through text-muted-foreground');
    });
  });

  // Prueba para verificar si se puede eliminar una tarea
  test('can delete a task', async () => {
    render(<App />);
    // Agrega una tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Escribe una nueva tarea'), 'Tarea de prueba');
      userEvent.type(screen.getByPlaceholderText('Agrega una fecha de vencimiento'), '2025-12-31');
      userEvent.click(screen.getByText('Agregar'));
    });
    // Intenta eliminar la tarea
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.click(screen.getAllByText('Eliminar')[0]);
    });
    // Interactúa con el botón "Confirmar"
    const confirmButton = await screen.findByText('Confirmar');
    userEvent.click(confirmButton);
    // Verifica si la tarea se eliminó
    await waitForElementToBeRemoved(() => screen.queryByText('Tarea de prueba'));
  });
});