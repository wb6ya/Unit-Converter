const FORM_IDS = ['weight-form', 'length-form', 'temperature-form'];
const FORM_UNITS = {
  'weight-form': ['milligram', 'gram', 'kilogram', 'metric ton', 'ounce', 'pound', 'stone'],
  'length-form': ['millimeter', 'centimeter', 'meter', 'kilometer', 'inch', 'foot', 'yard', 'mile'],
  'temperature-form': ['Celsius', 'Fahrenheit', 'Kelvin', 'Rankine']
};

const PLACEHOLDER_TEXT = 'Choose unit...';

const createOption = (value, text, config = {}) => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;

  if (config.disabled) {
    option.disabled = true;
  }

  if (config.selected) {
    option.selected = true;
  }

  return option;
};

const getSelectPair = (formId) => {
  const baseId = formId.replace('-form', '');
  return {
    fromSelect: document.getElementById(`${baseId}-from`),
    toSelect: document.getElementById(`${baseId}-to`)
  };
};

const resetSelectWithPlaceholder = (select) => {
  select.innerHTML = '';
  select.appendChild(createOption('', PLACEHOLDER_TEXT, { disabled: true, selected: true }));
};

const populateSelect = (select, units) => {
  units.forEach((unit) => {
    select.appendChild(createOption(unit, unit));
  });
};

const populateUnits = (formId) => {
  const { fromSelect, toSelect } = getSelectPair(formId);
  if (!fromSelect || !toSelect) {
    return;
  }

  const units = FORM_UNITS[formId] || [];
  resetSelectWithPlaceholder(fromSelect);
  resetSelectWithPlaceholder(toSelect);
  populateSelect(fromSelect, units);
  populateSelect(toSelect, units);
};

const switchForm = (selectedForm) => {
  const selectedFormId = `${selectedForm}-form`;

  FORM_IDS.forEach((formId) => {
    const form = document.getElementById(formId);
    if (!form) {
      return;
    }

    const isSelected = formId === selectedFormId;
    form.style.display = isSelected ? 'flex' : 'none';

    if (isSelected) {
      populateUnits(formId);
    }
  });
};

const updateToOptions = (selectedUnit, fromSelectId) => {
  const toSelectId = fromSelectId.replace('-from', '-to');
  const formId = fromSelectId.replace('-from', '-form');
  const toSelect = document.getElementById(toSelectId);

  if (!toSelect) {
    return;
  }

  const units = FORM_UNITS[formId] || [];
  resetSelectWithPlaceholder(toSelect);
  populateSelect(toSelect, units.filter((unit) => unit !== selectedUnit));
};

const getFieldLabel = (control) => {
  const label = document.querySelector(`label[for="${control.id}"]`);
  return label ? label.textContent.trim() : 'This field';
};

const showFieldError = (control, message) => {
  const field = control.closest('.field');
  if (!field) {
    return;
  }

  field.classList.add('field-error');

  let feedback = field.querySelector('.field-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'field-feedback';
    field.appendChild(feedback);
  }

  feedback.textContent = message;
};

const clearFieldError = (control) => {
  const field = control.closest('.field');
  if (!field) {
    return;
  }

  field.classList.remove('field-error');
};

const getValidationMessage = (control) => {
  const label = getFieldLabel(control);

  if (control.validity.valueMissing) {
    return `${label} is required.`;
  }

  if (control.validity.badInput || control.validity.typeMismatch) {
    return `Please enter a valid ${label.toLowerCase()}.`;
  }

  return 'Please check this field.';
};

const bindControlValidation = (control) => {
  control.addEventListener('invalid', (event) => {
    event.preventDefault();
    showFieldError(control, getValidationMessage(control));
  });

  const clearIfValid = () => {
    control.setCustomValidity('');
    if (control.checkValidity()) {
      clearFieldError(control);
    }
  };

  control.addEventListener('input', clearIfValid);
  control.addEventListener('change', clearIfValid);
};

const setupFormValidation = (form) => {
  const controls = form.querySelectorAll('input, select');
  controls.forEach(bindControlValidation);

  form.addEventListener('submit', (event) => {
    let firstInvalidControl = null;

    controls.forEach((control) => {
      if (!control.checkValidity()) {
        if (!firstInvalidControl) {
          firstInvalidControl = control;
        }
        showFieldError(control, getValidationMessage(control));
        return;
      }

      clearFieldError(control);
    });

    if (!firstInvalidControl) {
      return;
    }

    event.preventDefault();
    form.classList.remove('form-invalid');
    void form.offsetWidth;
    form.classList.add('form-invalid');
    firstInvalidControl.focus();
  });
};

const setupValidationStyles = () => {
  document.querySelectorAll('.simple-form').forEach(setupFormValidation);
};

populateUnits('weight-form');
setupValidationStyles();
