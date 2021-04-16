((UTILS, RENDERER) => {
  const BOTH = {
    tabcontent: document.getElementsByClassName('tabcontent-pdfs'),
    tablinks: document.getElementsByClassName('tablinks-pdfs'),
  };

  const LEFT = {
    dropZone: document.getElementById('dropZoneLeftPdf'),
    dropzoneInfo: document.getElementById('dropzoneInfoLeftPdf'),
    pdfFile: document.getElementById('fileLeftPdf'),
    dropzoneFile: document.getElementById('dropzoneFileLeftPdf'),
    dropzoneFileName: document.getElementById('dropzoneFileNameLeftPdf'),
    formFieldsNoEntries: document.getElementById('formFieldsNoEntriesLeftPdf'),
    formFieldsContainer: document.getElementById('formFieldsContainerLeftPdf'),
    tabcontent: document.getElementsByClassName('tabcontent-pdf_left'),
    tablinks: document.getElementsByClassName('tablinks-pdf_left'),
    simplifiedFormFields: document.getElementById('simplifiedFormFieldsLeftPdf'),
    rawFormFields: document.getElementById('rawFormFieldsLeftPdf'),
  };

  const RIGHT = {
    dropZone: document.getElementById('dropZone'),
    dropzoneInfo: document.getElementById('dropzoneInfo'),
    pdfFile: document.getElementById('pdfFile'),
    dropzoneFile: document.getElementById('dropzoneFile'),
    dropzoneFileName: document.getElementById('dropzoneFileName'),
    formFieldsNoEntries: document.getElementById('formFieldsNoEntries'),
    formFieldsContainer: document.getElementById('formFieldsContainer'),
    tabcontent: document.getElementsByClassName('tabcontent-pdf_right'),
    tablinks: document.getElementsByClassName('tablinks'),
    simplifiedFormFields: document.getElementById('simplifiedFormFields'),
    rawFormFields: document.getElementById('rawFormFields'),
  };

  let isNew = true;

  /**
   * DROPZONE
   */

  const _toggleDropzone = () => {
    if (!isNew) {
      return;
    }

    isNew = !isNew;

    LEFT.dropzoneInfo.classList.toggle('active');
    LEFT.dropzoneInfo.classList.toggle('hidden');
    LEFT.dropzoneFile.classList.toggle('active');
    LEFT.dropzoneFile.classList.toggle('hidden');

    LEFT.formFieldsNoEntries.classList.toggle('active');
    LEFT.formFieldsNoEntries.classList.toggle('hidden');
    LEFT.formFieldsContainer.classList.toggle('active');
    LEFT.formFieldsContainer.classList.toggle('hidden');
  };

  const _initDropzone = (droppedFile) => {
    LEFT.dropzoneFileName.innerText = droppedFile.name;
    LEFT.dropZone.style.borderColor = 'blue';
  };

  const _handleDrop = (ev) => {
    ev.preventDefault();

    UTILS.clearList();

    const droppedFile = UTILS.getPdfFile(ev);

    _toggleDropzone();
    _initDropzone(droppedFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const formFields = await UTILS.getPdfContent(pdf, pdf.numPages);
      RENDERER.fields(formFields, UTILS.CONSTANTS.LEFT.formFieldList, LEFT.simplifiedFormFields);
      RENDERER.raw(formFields, UTILS.CONSTANTS.LEFT.rawFieldList, LEFT.rawFormFields);
      RENDERER.viewer(pdf);
      document.getElementById('defaultOpenTabFields').click();
    };

    fileReader.readAsArrayBuffer(droppedFile);
  };

  const _handleDragOver = (ev) => {
    ev.preventDefault();
    LEFT.dropZone.style.borderColor = 'red';
  };

  const _handleDragLeave = (ev) => {
    ev.preventDefault();
    LEFT.dropZone.style.borderColor = 'blue';
  };

  /**
   * TABS
   */

  const _handleTabSwitchLeftMain = (ev) => {
    for (let i = 0; i < BOTH.tabcontent.length; i++) {
      BOTH.tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < BOTH.tablinks.length; i++) {
      BOTH.tablinks[i].classList.remove('selected');
    }

    const tabName = ev.currentTarget.dataset.tab;
    document.getElementById(tabName).style.display = 'flex';
    ev.currentTarget.classList.add('selected');
  };

  const _handleTabSwitchLeftSub = (ev) => {
    for (let i = 0; i < LEFT.tabcontent.length; i++) {
      LEFT.tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < LEFT.tablinks.length; i++) {
      LEFT.tablinks[i].classList.remove('selected');
    }

    const tabName = ev.currentTarget.dataset.tab;
    document.getElementById(tabName).style.display = 'flex';
    ev.currentTarget.classList.add('selected');
  };

  /**
   * SETUP
   */

  const initHandler = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'public/libs/pdfjs/build/pdf.worker.min.js';

    LEFT.dropZone.addEventListener('drop', _handleDrop);
    LEFT.dropZone.addEventListener('dragover', _handleDragOver);
    LEFT.dropZone.addEventListener('dragleave', _handleDragLeave);

    Array.from(BOTH.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftMain));
    Array.from(LEFT.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftSub));

    LEFT.pdfFile.addEventListener('change', _handleDrop);
  };

  const removeHandler = () => {
    LEFT.dropZone.removeEventListener('drop', _handleDrop);
    LEFT.dropZone.removeEventListener('dragover', _handleDragOver);
    LEFT.dropZone.removeEventListener('dragleave', _handleDragLeave);

    Array.from(BOTH.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftMain));
    Array.from(LEFT.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftSub));

    LEFT.pdfFile.removeEventListener('change', _handleDrop);
  };

  initHandler();
  window.addEventListener('beforeunload', removeHandler);
  document.getElementById('defaultOpenTabPdfs').click();

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js');
  // }
})(utils, renderer);
