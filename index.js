class BMICalculator {
  static CATEGORIES = [
    { max: 18.5, label: 'Недостаточный вес', color: 'text-blue-500' },
    { max: 23.0, label: 'Нормальный вес', color: 'text-green-500' },
    { max: 25.0, label: 'Избыточный вес', color: 'text-yellow-500' },
    { max: 30.0, label: 'Ожирение I степени', color: 'text-orange-500' },
    { max: 35.0, label: 'Ожирение II степени', color: 'text-red-400' },
    { max: Infinity, label: 'Ожирение III степени', color: 'text-red-600' }
  ];

  static PI_RANGES = {
    adult: { min: 11, max: 15, label: 'Нормальный диапазон (взрослые)' },
    child: { min: 2.2, max: 3.0, label: 'Нормальный диапазон (дети)' }
  };

  constructor() {
    this.isAdultMode = true;
    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    this.elements = {
      height: document.getElementById('height'),
      weight: document.getElementById('weight'),
      calculate: document.getElementById('calculateBtn'),
      result: document.getElementById('resultArea'),
      adult: document.getElementById('adultBtn'),
      child: document.getElementById('childBtn'),
      marker: document.querySelector('.marker'),
      error: {
        modal: document.getElementById('errorModal'),
        message: document.getElementById('errorMessage'),
        close: document.getElementById('closeModal'),
        confirm: document.getElementById('confirmModal')
      }
    };
  }

  addEventListeners() {
    this.elements.calculate.addEventListener('click', () => this.calculate());
    this.elements.adult.addEventListener('click', () => this.toggleMode(true));
    this.elements.child.addEventListener('click', () => this.toggleMode(false));
    this.elements.error.close.addEventListener('click', () => this.hideError());
    this.elements.error.confirm.addEventListener('click', () => this.hideError());
    [this.elements.height, this.elements.weight].forEach(input => 
      input.addEventListener('keypress', e => e.key === 'Enter' && this.calculate())
    );
  }

  calculate() {
    try {
      const height = parseFloat(this.elements.height.value) / 100;
      const weight = parseFloat(this.elements.weight.value);
      
      if (!this.validateInput(weight, height * 100)) throw new Error('Пожалуйста, введите корректный вес (кг) и рост (см)');

      const results = {
        bmi: this.roundTo(weight / (height * height)),
        modifiedBmi: this.roundTo(1.3 * weight / Math.pow(height, 2.5)),
        ponderal: this.roundTo(weight / Math.pow(height, 3))
      };

      this.updateUI(results);
    } catch (error) {
      this.showError(error.message);
    }
  }

  updateUI({ bmi, modifiedBmi, ponderal }) {
    const category = this.getCategory(bmi);
    const piEval = this.evaluatePonderalIndex(ponderal);

    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = `(${category.label})`;
    document.getElementById('bmiCategory').className = category.color;
    document.getElementById('modifiedBMI').textContent = modifiedBmi;
    document.getElementById('ponderalIndex').textContent = ponderal;
    document.getElementById('piCategory').textContent = piEval.label;
    document.getElementById('piCategory').className = piEval.color;

    this.elements.marker.style.left = `${Math.min(bmi / 40 * 100, 100)}%`;
    this.elements.result.classList.remove('hidden');
  }

  toggleMode(isAdult) {
    this.isAdultMode = isAdult;
    const [activeBtn, inactiveBtn] = isAdult ? 
      [this.elements.adult, this.elements.child] : 
      [this.elements.child, this.elements.adult];

    activeBtn.classList.replace('bg-gray-200', 'bg-blue-500');
    activeBtn.classList.replace('text-gray-700', 'text-white');
    inactiveBtn.classList.replace('bg-blue-500', 'bg-gray-200');
    inactiveBtn.classList.replace('text-white', 'text-gray-700');
  }

  validateInput(weight, height) {
    return !isNaN(weight) && !isNaN(height) && 
           weight > 2 && weight <= 300 && 
           height >= 40 && height <= 250;
  }

  getCategory(bmi) {
    return BMICalculator.CATEGORIES.find(cat => bmi < cat.max) || 
           BMICalculator.CATEGORIES[BMICalculator.CATEGORIES.length - 1];
  }

  evaluatePonderalIndex(pi) {
    const range = this.isAdultMode ? BMICalculator.PI_RANGES.adult : BMICalculator.PI_RANGES.child;
    return {
      label: pi >= range.min && pi <= range.max ? range.label : 'Вне нормального диапазона',
      color: pi >= range.min && pi <= range.max ? 'text-green-500' : 'text-yellow-500'
    };
  }

  roundTo(num, decimals = 1) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  showError(message) {
    this.elements.error.message.textContent = message;
    this.elements.error.modal.classList.remove('hidden');
  }

  hideError() {
    this.elements.error.modal.classList.add('hidden');
  }
}

const calculator = new BMICalculator();