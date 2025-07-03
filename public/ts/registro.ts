import { fetchApi } from './api';
import { showToast } from './utils';

function setupPasswordToggle(container: HTMLElement) {
    const input = container.querySelector<HTMLInputElement>('input[type="password"], input[type="text"]');
    const toggle = container.querySelector<HTMLElement>('.toggle-password');

    if (!input || !toggle) return;

    toggle.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = '🙈'; // Cambia el ícono
        } else {
            input.type = 'password';
            toggle.textContent = '👁️';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE VISIBILIDAD DE CONTRASEÑA ---
    document.querySelectorAll('.campo-password-contenedor').forEach(container => {
        setupPasswordToggle(container as HTMLElement);
    });

    
    const form = document.querySelector<HTMLFormElement>('.formulario');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const nombre = data.get('nombre') as string;
        const correo = data.get('correo') as string;
        const password = data.get('password') as string;
        const confirmar = data.get('confirmar') as string;

        if (password !== confirmar) {
            showToast('Las contraseñas no coinciden.', 'error');
            return;
        }

        try {
            const response = await fetchApi('/instructores', {
                method: 'POST',
                body: JSON.stringify({ nombre, correo, contraseña: password })
            });

            showSuccessModal("¡Instructor registrado exitosamente!");

        } catch (error) {
            if (error instanceof Error) {
                showSuccessModal("El instructor ya está registrado", true);

            }
        }
    });
});

function showSuccessModal(message: string, isError: boolean = false) {
    const modal = document.getElementById('successModal') as HTMLElement;
    const closeBtn = document.getElementById('closeModal') as HTMLElement;
    const modalMessage = document.getElementById('modalMessage') as HTMLElement;
    const okButton = document.getElementById('closeModal') as HTMLElement;

    modalMessage.textContent = message;

    if (isError) {
        okButton.classList.add('btn-ok-error');
        okButton.classList.remove('btn-ok');
    } else {
        okButton.classList.add('btn-ok');
        okButton.classList.remove('btn-ok-error');
    }

    modal.style.display = 'flex';

    closeBtn.addEventListener('click', () => {
        if (!isError) {
            window.location.href = 'inicioSesion.html';
        } else {
            modal.style.display = 'none';
        }
    });
}
