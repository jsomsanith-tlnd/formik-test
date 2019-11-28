import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const onSubmit = (values, { setSubmitting }) => {
  setSubmitting(true);
  setTimeout(() => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  }, 400);
};

function KeyValue({ field, status }) {
  const { name } = field;
  return (
    <fieldset>
      <Field type="text" name={`${name}.key`} />
      <ErrorMessage name={`${name}.key`} component="div" />
      <Field type="text" name={`${name}.value`} />
      {status === "VALIDATING_KEY_VALUE" ? (
        <div>Validating ...</div>
      ) : (
        <ErrorMessage name={`${name}.value`} component="div" />
      )}
    </fieldset>
  );
}

function validateEmail(value) {
  console.log("validate email");
  if (!value) {
    return "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return "Invalid email address";
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function validateKeyValue(keyValue) {
  if (!keyValue.value) {
    return;
  }
  return sleep(2000).then(() => {
    if (keyValue.value === "qsd") {
      return { value: "Must not be qsd" };
    }
  });
}

const validate = values => {
  const errors = {};

  const emailError = validateEmail(values.user.email);
  if (emailError) {
    errors.user = { email: emailError };
  }

  const keyValueError = validateKeyValue(values.keyValue.value);
  if (keyValueError) {
    errors.keyValue = keyValueError;
  }
};

function App() {
  return (
    <Formik
      initialValues={{
        user: { email: "aze@aze.com" },
        password: "aze",
        keyValue: { key: "", value: "" },
        private: false
      }}
      // validate={validate}
      // validate={values => {
      //   console.log("global validation");
      //   return values.email.indexOf("lol") > -1 ? { email: "lol" } : {};
      // }}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {args => {
        console.log("args", args);
        const { isSubmitting, setStatus, status, values } = args;

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        function asyncValidateKeyValue(keyValue) {
          setStatus("VALIDATING_KEY_VALUE");
          return sleep(2000)
            .then(() => {
              if (keyValue.value === "qsd") {
                return { value: "Must not be qsd" };
              }
            })
            .finally(() => setStatus());
        }

        return (
          <Form>
            <Field type="email" name="email" validate={validateEmail} />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <Field name="private" type="checkbox" />
            {values.private && (
              <Field
                name="keyValue"
                component={KeyValue}
                validate={asyncValidateKeyValue}
                status={status}
              />
            )}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default App;
