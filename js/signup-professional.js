$(document).ready(function() {
    $('#user-info').hide();
    $('#error-message-signin').hide();
    $('#error-message-signup').hide();
    $('#signup-section').hide();

    axios.defaults.baseURL = 'http://localhost:8080/professional';
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    const inputs = [
        'email',
        'password',
        'name',
        'cpf',
        'crm',
        'specialty',
    ];

    $('#signup-button').click((e) => showSignup());
    $('#signin-button').click((e) => showSignin());

    $('#signup-form').submit(function(e) {
        e.preventDefault();
        $('#submit-button').prop('disabled', true);
        const values = {};
        for (const input of inputs) {
            values[input] = $(e.target).find(`#${input}`).val();
        }
        if (signinState) {
            signin(values);
        } else {
            signup(values);
        }
    });

    $('#signoff-button').click((e) => signoff());

    updatePage();
});

const updatePage = () => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        $('#user-info').show();
        $('#signup-form').hide();
        $('#user-name').text(userInfo.name);
    }
}

const signin = (values) => {
    return axios.post('/signin', values).then(
        res => {
            const { name, crm, email, specialty, cpf } = res.data.existingProfessional;
            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify({ name, crm, email, specialty, cpf }));
        }
    ).catch(
        () => updateErrorMessage('Não foi possível entrar com a credencial fornecida, por favor verifique os dados inseridos.'),
    ).finally(() => {
        $('#submit-button').prop('disabled', false);
        updatePage();
    });
}

const signup = (values) => {
    return axios.post('', values).then(
        () => signin(values),
    ).catch(
        () => updateErrorMessage('Não foi possível cadastrar o profissional, por favor verifique os dados enviados.'),
    ).finally(() => {
        $('#submit-button').prop('disabled', false);
        updatePage();
    });
}

const signoff = () => {
    localStorage.clear();
    $('#user-info').hide();
    $('#signup-form').show();
}

const updateErrorMessage = (error) => {
    $('#error-message-signin').show();
    $('#error-message-signin').text(error);
    $('#error-message-signup').show();
    $('#error-message-signup').text(error);
}

let signinState = true;

const showSignup = () => {
    signinState = false;
    $('#error-message-signin').hide();
    $('#error-message-signup').hide();
    $('#signin-section').hide();
    $('#signup-section').show();
}

const showSignin = () => {
    signinState = true;
    $('#error-message-signin').hide();
    $('#error-message-signup').hide();
    $('#signin-section').show();
    $('#signup-section').hide();
}
