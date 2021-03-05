(() => {
  const dropZone = document.getElementById('dropZone');
  const dropzoneInfo = document.getElementById('dropzoneInfo');
  const dropzoneFile = document.getElementById('dropzoneFile');
  const dropzoneFileName = document.getElementById('dropzoneFileName');
  const formFieldsNoEntries = document.getElementById('formFieldsNoEntries');
  const formFieldsContainer = document.getElementById('formFieldsContainer');
  const tablinks = document.getElementsByClassName('tablinks');
  const simplifiedFormFields = document.getElementById('simplifiedFormFields');
  const rawFormFields = document.getElementById('rawFormFields');
  const pdfFile = document.getElementById('pdfFile');

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
          buttonValue: annotation.buttonValue,
        };
      });

      formFields[index] = {
        page: index,
        fields,
        raw: annotations,
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
          liValue.innerText = 'Wert: ' + (field.value ? field.value : field.buttonValue);
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

    simplifiedFormFields.appendChild(ul);
  };

  const _renderRaw = (entries) => {
    const holder = document.createElement('div');
    holder.id = 'rawFieldList';

    Object.values(entries).forEach((entry) => {
      if (entry.fields.length === 0) {
        const pageHolder = document.createElement('div');
        const pageHeader = document.createElement('h4');
        pageHeader.innerText = 'Seite ' + entry.page;

        const pageSpan = document.createElement('span');
        pageSpan.innerText = 'keine Felder enthalten';
        pageSpan.classList.add('no-entry_item');

        pageHolder.appendChild(pageHeader);
        pageHolder.appendChild(pageSpan);

        holder.appendChild(pageHolder);
      } else {
        const pageHolder = document.createElement('div');
        const pageHeader = document.createElement('h4');
        pageHeader.innerText = 'Seite ' + entry.page;

        const pageCode = document.createElement('code');
        const pagePre = document.createElement('pre');
        pagePre.innerHTML = JSON.stringify(entry.raw, null, 2);
        pageCode.appendChild(pagePre);

        pageHolder.appendChild(pageHeader);
        pageHolder.appendChild(pageCode);

        holder.appendChild(pageHolder);
      }
    });

    rawFormFields.appendChild(holder);
  };

  const _renderViewer = (pdf) => {
    const container = document.getElementById('viewerContainer');
    const eventBus = new pdfjsViewer.EventBus();

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container,
      eventBus,
    });

    eventBus.on('pagesinit', function () {
      pdfViewer.currentScaleValue = 'page-width';
    });

    pdfViewer.setDocument(pdf);
  };

  const _clearList = () => {
    const formFieldList = document.getElementById('formFieldList');
    if (formFieldList) {
      formFieldList.parentNode.removeChild(formFieldList);
    }
    const rawFieldList = document.getElementById('rawFieldList');
    if (rawFieldList) {
      rawFieldList.parentNode.removeChild(rawFieldList);
    }
  };

  /**
   * DROPZONE
   */

  const _getPdfFile = (ev) => {
    return 'dataTransfer' in ev
      ? ev.dataTransfer.items && ev.dataTransfer.items[0].kind === 'file'
        ? ev.dataTransfer.items[0].getAsFile()
        : ev.dataTransfer.files[0]
      : ev.target.files[0];
  };

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
  };

  const _handleDrop = (ev) => {
    ev.preventDefault();

    _clearList();

    const droppedFile = _getPdfFile(ev);

    _toggleDropzone();
    _initDropzone(droppedFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const formFields = await _getPdfContent(pdf, pdf.numPages);
      _render(formFields);
      _renderRaw(formFields);
      _renderViewer(pdf);
      document.getElementById('defaultOpen').click();
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
   * TABS
   */

  const _handleTabSwitch = (ev) => {
    const tabName = ev.currentTarget.dataset.tab;

    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('selected');
    }

    document.getElementById(tabName).style.display = 'flex';
    ev.currentTarget.classList.add('selected');
  };

  /**
   * SETUP
   */

  const initHandler = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'public/libs/pdfjs/build/pdf.worker.min.js';

    dropZone.addEventListener('drop', _handleDrop);
    dropZone.addEventListener('dragover', _handleDragOver);
    dropZone.addEventListener('dragleave', _handleDragLeave);

    Array.from(tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitch));

    pdfFile.addEventListener('change', _handleDrop);
  };

  const removeHandler = () => {
    dropZone.removeEventListener('drop', _handleDrop);
    dropZone.removeEventListener('dragover', _handleDragOver);
    dropZone.removeEventListener('dragleave', _handleDragLeave);

    Array.from(tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitch));

    pdfFile.removeEventListener('change', _handleDrop);
  };

  initHandler();
  window.addEventListener('beforeunload', removeHandler);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
})();
