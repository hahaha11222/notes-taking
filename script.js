document.addEventListener('DOMContentLoaded', function () {
  window.showPage = function (id) {
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    document.body.classList.toggle('theme-home', id === 'home');
  };

  window.setTheme = function (theme) {
    document.body.className = `theme-${theme} theme-home`;
  };

  document.getElementById('profile-upload').addEventListener('change', function () {
    if (this.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profile-pic').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  let isSelecting = false;
  let trashBtn = null;

  function createTrashIcon() {
    if (!trashBtn) {
      const header = document.querySelector('#watchlist h2');
      const wrapper = document.createElement('div');
      wrapper.className = 'watchlist-header';
      header.replaceWith(wrapper);

      const h2 = document.createElement('h2');
      h2.textContent = 'Watchlist';
      wrapper.appendChild(h2);

      trashBtn = document.createElement('button');
      trashBtn.innerHTML = '🗑️';
      trashBtn.className = 'trash-icon';
      trashBtn.onclick = () => {
        const selected = document.querySelectorAll('.folder-checkbox input:checked');
        selected.forEach(input => {
          const wrapper = input.closest('.folder-wrapper');
          wrapper.remove();
        });
        if (document.querySelectorAll('.folder-wrapper').length === 0) {
          const note = document.createElement('p');
          note.textContent = 'No folders yet. Tap the + button to create one.';
          note.id = 'empty-watchlist';
          note.style.textAlign = 'center';
          note.style.marginTop = '20px';
          note.style.opacity = '0.6';
          note.style.width = '100%';
          note.style.pointerEvents = 'none';
          document.getElementById('watchlist-folders').appendChild(note);
        }
        exitSelectMode();
      };
      wrapper.appendChild(trashBtn);
    }
  }

  function exitSelectMode() {
    isSelecting = false;
    document.querySelectorAll('.folder-wrapper').forEach(wrapper => {
      wrapper.classList.remove('select-mode');
      const checkbox = wrapper.querySelector('.folder-checkbox input');
      if (checkbox) checkbox.checked = false;
    });
    if (trashBtn) trashBtn.remove();
    trashBtn = null;

    const hWrap = document.createElement('h2');
    hWrap.textContent = 'Watchlist';
    const container = document.querySelector('.watchlist-header');
    container.replaceWith(hWrap);
  }

  window.createFolder = function (name, color) {
    const container = document.getElementById('watchlist-folders');
    const emptyNote = document.getElementById('empty-watchlist');
    if (emptyNote) emptyNote.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'folder-wrapper';

    const folder = document.createElement('div');
    folder.className = 'drive-folder';
    folder.style.backgroundColor = color;
    folder.style.opacity = '0';
    folder.style.transform = 'scale(0.85)';

    const label = document.createElement('div');
    label.className = 'folder-name';
    label.textContent = name;

    const checkboxWrap = document.createElement('div');
    checkboxWrap.className = 'folder-checkbox';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxWrap.appendChild(checkbox);
    folder.appendChild(checkboxWrap);

    let pressTimer;
    folder.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      pressTimer = setTimeout(() => {
        isSelecting = true;
        createTrashIcon();
        document.querySelectorAll('.folder-wrapper').forEach(fw => {
          fw.classList.add('select-mode');
        });
        checkbox.checked = true;
      }, 500);
    });

    folder.addEventListener('mouseup', () => clearTimeout(pressTimer));
    folder.addEventListener('mouseleave', () => clearTimeout(pressTimer));

    const actions = document.createElement('div');
    actions.className = 'folder-actions hidden';

    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.onclick = (e) => {
      e.stopPropagation();
      const renameOverlay = document.createElement('div');
      renameOverlay.className = 'folder-popup';

      const popup = document.createElement('div');
      popup.className = 'popup-content';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'New folder name';
      input.value = label.textContent;

      const buttons = document.createElement('div');
      buttons.className = 'popup-buttons';

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.onclick = () => {
        const newName = input.value.trim();
        if (newName) {
          label.textContent = newName;
          renameOverlay.remove();
        }
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.background = '#aaa';
      cancelBtn.style.color = '#fff';
      cancelBtn.onclick = () => renameOverlay.remove();

      buttons.appendChild(saveBtn);
      buttons.appendChild(cancelBtn);
      popup.appendChild(input);
      popup.appendChild(buttons);
      renameOverlay.appendChild(popup);
      document.body.appendChild(renameOverlay);
    };

    actions.appendChild(renameBtn);
    folder.appendChild(actions);
    folder.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      actions.classList.toggle('hidden');
    });

    wrapper.appendChild(folder);
    wrapper.appendChild(label);
    container.appendChild(wrapper);

    requestAnimationFrame(() => {
      folder.style.transition = 'all 0.3s ease';
      folder.style.opacity = '1';
      folder.style.transform = 'scale(1)';
    });
  };

  window.showFolderPrompt = function () {
    const existing = document.querySelector('.folder-popup');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'folder-popup';

    const popup = document.createElement('div');
    popup.className = 'popup-content';

    const title = document.createElement('h3');
    title.textContent = 'New Folder';
    popup.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Folder name';
    popup.appendChild(input);

    const warning = document.createElement('p');
    warning.style.color = 'red';
    warning.style.fontSize = '12px';
    warning.style.margin = '0';
    warning.style.display = 'none';
    popup.appendChild(warning);

    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Choose color:';
    popup.appendChild(colorLabel);

    const colorWrapper = document.createElement('div');
    colorWrapper.style.display = 'flex';
    colorWrapper.style.alignItems = 'center';
    colorWrapper.style.gap = '10px';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#cccccc';
    colorWrapper.appendChild(colorInput);

    const colorDot = document.createElement('span');
    colorDot.style.width = '20px';
    colorDot.style.height = '20px';
    colorDot.style.borderRadius = '50%';
    colorDot.style.border = '1px solid #ccc';
    colorDot.style.backgroundColor = colorInput.value;
    colorWrapper.appendChild(colorDot);

    const colorHexLabel = document.createElement('span');
    colorHexLabel.textContent = colorInput.value;
    colorHexLabel.style.fontFamily = 'monospace';
    colorWrapper.appendChild(colorHexLabel);

    colorInput.addEventListener('input', () => {
      colorDot.style.backgroundColor = colorInput.value;
      colorHexLabel.textContent = colorInput.value;
    });

    popup.appendChild(colorWrapper);

    const buttons = document.createElement('div');
    buttons.className = 'popup-buttons';

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';
    createBtn.onclick = () => {
      const name = input.value.trim();
      if (name) {
        window.createFolder(name, colorInput.value);
        overlay.remove();
      } else {
        warning.textContent = 'Please enter a folder name.';
        warning.style.display = 'block';
      }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.background = '#aaa';
    cancelBtn.style.color = '#fff';
    cancelBtn.onclick = () => overlay.remove();

    buttons.appendChild(createBtn);
    buttons.appendChild(cancelBtn);
    popup.appendChild(buttons);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      window.showPage(target);
    });
  });

  // Empty notes
  const folderContainer = document.getElementById('watchlist-folders');
  if (folderContainer && folderContainer.children.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'No folders yet. Tap the + button to create one.';
    note.id = 'empty-watchlist';
    note.style.textAlign = 'center';
    note.style.marginTop = '20px';
    note.style.opacity = '0.6';
    note.style.width = '100%';
    note.style.pointerEvents = 'none';
    folderContainer.appendChild(note);
  }

  const watchingContainer = document.getElementById('watching-movies');
  if (watchingContainer && watchingContainer.children.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'Nothing here yet. Add movies you are watching.';
    note.id = 'empty-watching';
    note.style.textAlign = 'center';
    note.style.marginTop = '20px';
    note.style.opacity = '0.6';
    note.style.width = '100%';
    note.style.gridColumn = '1 / -1';
    note.style.pointerEvents = 'none';
    watchingContainer.appendChild(note);
  }

  const finishedContainer = document.getElementById('finished-movies');
  if (finishedContainer && finishedContainer.children.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'No finished movies yet.';
    note.id = 'empty-finished';
    note.style.textAlign = 'center';
    note.style.marginTop = '20px';
    note.style.opacity = '0.6';
    note.style.width = '100%';
    note.style.gridColumn = '1 / -1';
    note.style.pointerEvents = 'none';
    finishedContainer.appendChild(note);
  }
});
