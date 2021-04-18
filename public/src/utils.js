const utils = (() => {
  const _CONSTANTS = {
    LEFT: {
      formFieldList: 'formFieldListLeftPdf',
      rawFieldList: 'rawFieldListLeftPdf',
      viewer: 'viewerContainerLeftPdf',
    },
    RIGHT: {
      formFieldList: 'formFieldListRightPdf',
      rawFieldList: 'rawFieldListRightPdf',
      viewer: 'viewerContainerRightPdf',
    },
    DIFF: {
      container: 'diffingContainerResult',
      TAB_ID: 2,
    },
  };

  const _extractValue = (annotation) => {
    const fieldType = annotation.fieldType;
    const fieldValue = annotation.fieldValue;
    const buttonValue = annotation.buttonValue;

    let result = '-';

    if (fieldType === 'Tx') {
      result = fieldValue === undefined || fieldValue.length === 0 ? '-' : fieldValue;
    } else if (fieldType === 'Btn') {
      if (buttonValue === undefined) {
        result = fieldValue === undefined || fieldValue.length === 0 ? '-' : fieldValue;
      } else if (buttonValue.length === 0) {
        result = '-';
      } else {
        result = buttonValue;
      }
    }

    return result;
  };

  const _getPdfFile = (ev) => {
    return 'dataTransfer' in ev
      ? ev.dataTransfer.items && ev.dataTransfer.items[0].kind === 'file'
        ? ev.dataTransfer.items[0].getAsFile()
        : ev.dataTransfer.files[0]
      : ev.target.files[0];
  };

  const _getPdfContent = async (pdfInstance, totalPagesCount) => {
    let formFields = {};

    for (let index = 1; index <= totalPagesCount; index++) {
      const page = await pdfInstance.getPage(index);
      const annotations = await page.getAnnotations();
      const fields = annotations.map((annotation) => {
        return {
          name: annotation.fieldName,
          type: annotation.fieldType,
          value: _extractValue(annotation),
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

  const _clearList = (idsForClearing) => {
    for (const id of idsForClearing) {
      const list = document.getElementById(id);
      if (list) {
        list.parentNode.removeChild(list);
      }
    }
  };

  const _removeRaw = (fields) => {
    const copiedFields = JSON.parse(JSON.stringify(fields));
    Object.values(copiedFields).forEach((entry) => delete entry.raw);
    return copiedFields;
  };

  const _isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  return {
    CONSTANTS: _CONSTANTS,
    getPdfFile: _getPdfFile,
    getPdfContent: _getPdfContent,
    clearList: _clearList,
    removeRaw: _removeRaw,
    isEmpty: _isEmpty,
  };
})();
