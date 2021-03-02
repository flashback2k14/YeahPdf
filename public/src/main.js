(() => {
  const dropZone = document.getElementById('dropZone');
  const dropzoneInfo = document.getElementById('dropzoneInfo');
  const dropzoneFile = document.getElementById('dropzoneFile');
  const dropzoneFileName = document.getElementById('dropzoneFileName');
  const formFieldsNoEntries = document.getElementById('formFieldsNoEntries');
  const formFieldsContainer = document.getElementById('formFieldsContainer');

  let isNew = true;

  /**
   * PDF
   */

  const _getPdfContent = async (pdfInstance, totalPagesCount) => {
    let formFields = {};

    for (let index = 1; index <= totalPagesCount; index++) {
      const page = await pdfInstance.getPage(index);
      const annotations = await page.getAnnotations();
      const fields = annotations.map((annotation) => {
        return {
          name: annotation.fieldName,
          type: annotation.fieldType,
          value: annotation.fieldValue,
        };
      });

      formFields[index] = {
        page: index,
        fields,
      };
    }

    return formFields;
  };

  const _render = (entries) => {
    const ul = document.createElement('ul');
    ul.id = 'formFieldList';

    Object.values(entries).forEach((entry) => {
      const pageLi = document.createElement('li');
      pageLi.innerText = 'Seite ' + entry.page;
      pageLi.classList.add('page-list_item');

      const pageUl = document.createElement('ul');

      if (entry.fields.length === 0) {
        const noEntry = document.createElement('li');
        noEntry.innerText = 'keine Felder enthalten';
        noEntry.classList.add('no-entry_item');
        pageUl.appendChild(noEntry);
      } else {
        entry.fields.forEach((field) => {
          const liName = document.createElement('li');
          liName.innerText = 'Feldname: ' + field.name;
          liName.classList.add('entry_item');

          const fieldUl = document.createElement('ul');

          const liType = document.createElement('li');
          liType.innerText = 'Typ: ' + field.type;
          liType.classList.add('entry_item');

          const liValue = document.createElement('li');
          liValue.innerText = 'Wert: ' + field.value;
          liValue.classList.add('entry_item');

          fieldUl.appendChild(liType);
          fieldUl.appendChild(liValue);

          liName.appendChild(fieldUl);
          pageUl.appendChild(liName);
        });
      }

      pageLi.appendChild(pageUl);
      ul.appendChild(pageLi);
    });

    formFieldsContainer.appendChild(ul);
  };

  const _clearList = () => {
    const formFieldList = document.getElementById('formFieldList');
    if (formFieldList) {
      formFieldList.parentNode.removeChild(formFieldList);
    }
  };

  /**
   * DROPZONE
   */

  const _toggleDropzone = () => {
    if (!isNew) {
      return;
    }

    isNew = !isNew;

    dropzoneInfo.classList.toggle('active');
    dropzoneInfo.classList.toggle('hidden');
    dropzoneFile.classList.toggle('active');
    dropzoneFile.classList.toggle('hidden');

    formFieldsNoEntries.classList.toggle('active');
    formFieldsNoEntries.classList.toggle('hidden');
    formFieldsContainer.classList.toggle('active');
    formFieldsContainer.classList.toggle('hidden');
  };

  const _initDropzone = (droppedFile) => {
    dropzoneFileName.innerText = droppedFile.name;
    dropZone.style.borderColor = 'blue';
  }

  const _handleDrop = (ev) => {
    ev.preventDefault();

    _clearList();

    let droppedFile;

    if (ev.dataTransfer.items && ev.dataTransfer.items[0].kind === 'file') {
      var file = ev.dataTransfer.items[0].getAsFile();
      droppedFile = file;
    } else {
      droppedFile = ev.dataTransfer.files[0];
    }

    _toggleDropzone();
    _initDropzone(droppedFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const formFields = await _getPdfContent(pdf, pdf.numPages);
      _render(formFields);
    };

    fileReader.readAsArrayBuffer(droppedFile);
  };

  const _handleDragOver = (ev) => {
    ev.preventDefault();
    dropZone.style.borderColor = 'red';
  };

  const _handleDragLeave = (ev) => {
    ev.preventDefault();
    dropZone.style.borderColor = 'blue';
  };

  /**
   * SETUP
   */

  const initHandler = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js';
    dropZone.addEventListener('drop', _handleDrop);
    dropZone.addEventListener('dragover', _handleDragOver);
    dropZone.addEventListener('dragleave', _handleDragLeave);
  };

  const removeHandler = () => {
    dropZone.removeEventListener('drop', _handleDrop);
    dropZone.removeEventListener('dragover', _handleDragOver);
    dropZone.removeEventListener('dragleave', _handleDragLeave);
  };

  initHandler();
  window.addEventListener('beforeunload', removeHandler);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('public/src/service-worker.js');
  }
})();
