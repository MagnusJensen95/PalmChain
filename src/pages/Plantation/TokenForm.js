import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from '@material-ui/core'




const validate = values => {
    const errors = {}
    const requiredFields = [
        'weight',
        'timestamp'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }
    return errors
}

const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}) => (
        <TextField

            label={label}

            {...input}
            {...custom}
        />
    )



const TokenForm = props => {
    const { handleSubmit, pristine, reset, submitting } = props
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="firstName"
                    component={renderTextField}
                    label="First Name"
                />
            </div>
            <div>
                <Field name="lastName" component={renderTextField} label="Last Name" />
            </div>
            <div>
                <Field name="email" component={renderTextField} label="Email" />
            </div>



            <div>
                <Field
                    name="notes"
                    component={renderTextField}
                    label="Notes"
                    multiLine={true}
                    rows={2}
                />
            </div>
            <div>
                <button type="submit" disabled={pristine || submitting}>
                    Submit
        </button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>
                    Clear Values
        </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'TokenForm', // a unique identifier for this form
    validate
})(TokenForm)