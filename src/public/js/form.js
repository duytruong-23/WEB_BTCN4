// Đối tượng `Validator`
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    let selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        let errorMessage;

        // Lấy ra các rules của selector
        let rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (let i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    let formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            let isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                //Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');
                    let formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });
        });
    }

}



// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)

//bắt buộc nhập
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}

//Là email
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

//Viết hoa chữ cái đầu từng từ
Validator.uppercaseFirstLetter = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^[A-Z].*$/;
            return regex.test(value) ? undefined : message || 'Viết hoa chữ cái đầu'
        }
    };
};

//chỉ gồm các ký tự, ký số và dấu _, không được bắt đầu bởi ký số
Validator.isValidUsername = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^[a-zA-Z_][a-zA-z_|0-9]{2,}$/;
            return regex.test(value) ? undefined : message || 'Có ít nhất 3 kí tự, chỉ gồm các chữ cái, kí số và _, không được bắt đầu với kí số'
        }
    };
};

//Là số điện thoại
Validator.isPhoneNumber = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^0\d{9}$/;
            return regex.test(value) ? undefined : message || 'Số điện thoại gồm 10 số và bắt đầu với số 0'
        }
    };
};

Validator.isValidPassword = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
            return regex.test(value) ? undefined : message || 'Mật khẩu có ít nhất 4 ký tự, có ít nhất một kí tự chữ cái'
        }
    };
};

Validator.confirmPassword = function (selector, passwordSelector, message) {
    return {
        selector: selector,
        test: function (value) {
            const password = document.querySelector(passwordSelector).value;
            return value === password ? undefined : message || 'Mật khẩu xác nhận không khớp';
        }
    }
}

Validator.isValidBirthdate = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            console.log(value);
            let valid = true;
            let regex = /^(\d{4})-(0[1-9]|1[0-2])-(0?[1-9]|1\d|2\d|3[01])$/;
            if (regex.test(value)) {
                let [year, month, day] = value.split('-');
                day = parseFloat(day);
                month = parseInt(month);
                year = parseInt(year);
                valid = day <= getMaxDayOfMonth(month, year) && year <= 2004;
            }
            else {
                valid = false;
            }
            return valid ? undefined : message || 'Ngày không hợp lệ'
        }
    };
};


function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getMaxDayOfMonth(month, year) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            if (isLeapYear(year)) {
                return 29;
            }
            else {
                return 28;
            }
        default: return undefined;
    }
}
