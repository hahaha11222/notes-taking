document.addEventListener('DOMContentLoaded', function () {
  // ✅ Set black theme as default on load
  document.body.className = 'theme-black theme-home';

  const navbar = document.querySelector('.navbar');

  window.showPage = function (id) {
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    document.body.classList.toggle('theme-home', id === 'home');

    // ✅ Hide navbar on other pages
    if (navbar) {
      navbar.style.display = id === 'home' ? 'flex' : 'none';
    }
  };

  window.setTheme = function (theme) {
    const isHome = document.getElementById('home')?.classList.contains('hidden') === false;
    document.body.className = `theme-${theme}` + (isHome ? ' theme-home' : '');
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

  document.getElementById('trash-icon').addEventListener('click', () => {
    const folderWrappers = document.querySelectorAll('.folder-wrapper');
    if (folderWrappers.length === 0) return;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.3)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 1000;

    const popup = document.createElement('div');
    popup.style.background = '#fff';
    popup.style.padding = '16px';
    popup.style.borderRadius = '8px';
    popup.style.width = '220px';
    popup.style.fontSize = '14px';
    popup.style.fontFamily = 'Poppins, sans-serif';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.gap = '6px';

    const title = document.createElement('p');
    title.textContent = 'Select folders to delete';
    title.style.margin = '0 0 10px 0';
    title.style.fontWeight = '600';
    popup.appendChild(title);

    const selectedWrappers = new Set();

    folderWrappers.forEach(wrapper => {
      const name = wrapper.querySelector('.folder-name')?.textContent || 'Untitled';

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.cursor = 'pointer';
      row.style.padding = '4px 6px';
      row.style.borderRadius = '4px';
      row.style.transition = 'background 0.2s';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.margin = '0';

      const label = document.createElement('span');
      label.textContent = `📁 ${name}`;
      label.style.flex = '1';

      row.appendChild(checkbox);
      row.appendChild(label);

      row.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          selectedWrappers.add(wrapper);
          row.style.background = '#f0f0f0';
        } else {
          selectedWrappers.delete(wrapper);
          row.style.background = 'transparent';
        }
      });

      popup.appendChild(row);
    });

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.justifyContent = 'flex-end';
    buttonRow.style.gap = '8px';
    buttonRow.style.marginTop = '12px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.border = 'none';
    cancelBtn.style.padding = '6px 12px';
    cancelBtn.style.background = '#aaa';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.onclick = () => overlay.remove();

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '6px 12px';
    deleteBtn.style.background = '#e63946';
    deleteBtn.style.color = '#fff';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.onclick = () => {
      selectedWrappers.forEach(w => w.remove());
      overlay.remove();
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
    };

    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(deleteBtn);
    popup.appendChild(buttonRow);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      window.showPage(target);
    });
  });

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
