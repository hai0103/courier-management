import React, {useEffect} from "react";
import withoutAuth from "hocs/withoutAuth";
import Link from "next/link";
import {IMAGES, ROUTES} from "../../constants/common";
import {FormControl, Response} from "utils/common";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import FormRules from "utils/formRules";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import {UserApi} from "services/user";
import {useToasts} from "react-toast-notifications";

const Register = () => {
  const {register, errors, handleSubmit, watch, setError, clearErrors} = useForm();
  const {t} = useTranslation('common');
  const {addToast} = useToasts();

  const onClose = () => {
    // router.push(ROUTES.LOGIN);
    window.open('http://localhost:2808')
  }
  useEffect(() => {
    if (watch('verify-password') !== watch('password')) {
      setError('verify-password', {
        type: 'manual',
        message: 'Nhập lại mật khẩu chưa trùng khớp'
      })
    } else {
      clearErrors('verify-password')
    }
  }, [watch('verify-password')])

  const onSubmit = async (data) => {
    console.log(data);
    const payload = {
      phone: data.phone,
      password: data.password,
      full_name: data.full_name,
      user_type_id: 2
    }

    const response = await UserApi.create(payload);
    if (Response.isSuccessAPI(response)) {
      addToast('Tạo tài khoản thành công. Vui lòng chờ xác nhận', {appearance: 'success'});
      onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const usernameControl = () => {
    const validation = FormControl.getValidation('full_name', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control-lg',
      validation.className
    ]);
    const rules = {
      required: FormRules.required()
    };

    return {
      classNames,
      rules,
      ...validation
    }
  }

  const phoneControl = () => {
    const validation = FormControl.getValidation('phone', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control-lg',
      validation.className
    ]);
    const rules = {
      required: FormRules.required(),
      minLength: FormRules.minLength(10),
      maxLength: FormRules.maxLength(14)
    };

    return {
      classNames,
      rules,
      ...validation
    }
  }

  const passwordControl = () => {
    const validation = FormControl.getValidation('password', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control-lg',
      validation.className
    ]);
    const rules = {
      minLength: FormRules.minLength(6),
      required: FormRules.required()
    };

    return {
      classNames,
      rules,
      ...validation
    }
  }

  const verifyPasswordControl = () => {
    const validation = FormControl.getValidation('verify-password', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control-lg',
      validation.className
    ]);
    const rules = {
      minLength: FormRules.minLength(6),
      required: FormRules.required()
    };

    return {
      classNames,
      rules,
      ...validation
    }
  }

  return (
    <section className="row flexbox-container">
      <div className="col-12 d-flex align-items-center justify-content-center">
        <div className="col-lg-4 col-md-8 col-10 box-shadow-2 p-0">
          <div className="card border-grey border-lighten-3 px-2 py-2 m-0">
            <div className="card-header border-0">
              <div className="card-title text-center">
                <img src={IMAGES.LOGO}
                     alt="branding logo"/>
              </div>
              <h3 className="card-subtitle line-on-side text-muted text-center pt-2">
                <span>Tạo tài khoản mới</span>
              </h3>
            </div>
            <div className="card-content">
              <div className="card-body">
                <form className="form-horizontal form-simple" onSubmit={handleSubmit(onSubmit)}>
                  <fieldset className="form-group form-group-sm mb-1">
                    <label>
                      Họ và tên
                    </label>
                    <article>
                      <div className="position-relative has-icon-right">
                        <input ref={register(usernameControl().rules)}
                               type="text"
                               className={usernameControl().classNames}
                               name="full_name"
                               placeholder="Nhập họ và tên"
                        />
                        <InvalidFeedBack message={usernameControl().errorMessage}/>
                      </div>
                    </article>
                  </fieldset>
                  <fieldset className="form-group form-group-sm mb-1">
                    <label>Số điện thoại</label>
                    <article>
                      <div className="position-relative has-icon-right">
                        <input type="number"
                               className={phoneControl().classNames}
                               placeholder="Nhập số điện thoại"
                               name="phone"
                               ref={register(phoneControl().rules)}
                        />
                        <InvalidFeedBack message={phoneControl().errorMessage}/>
                      </div>
                    </article>
                  </fieldset>
                  <fieldset className="form-group form-group-sm">
                    <label>Mật khẩu</label>
                    <article>
                      <div className="position-relative has-icon-right">
                        <input type="password"
                               className={passwordControl().classNames}
                               placeholder={t('register.password')}
                               name="password"
                               ref={register(passwordControl().rules)}
                        />
                        <InvalidFeedBack message={passwordControl().errorMessage}/>
                      </div>
                    </article>
                  </fieldset>

                  <fieldset className="form-group form-group-sm">
                    <label>Nhập lại mật khẩu</label>
                    <article>
                      <div className="position-relative has-icon-right">
                        <input type="password"
                               className={verifyPasswordControl().classNames}
                               placeholder="Nhập lại mật khẩu"
                               name="verify-password"
                               ref={register(verifyPasswordControl().rules)}
                        />
                        <InvalidFeedBack message={verifyPasswordControl().errorMessage}/>
                      </div>
                    </article>
                  </fieldset>
                  <button type="submit" className="btn btn-primary btn-block">Đăng ký ngay</button>
                </form>
              </div>
              <p className="text-center">
                {t('register.question')} <Link href={ROUTES.LOGIN}>
                <a className="card-link">{t('register.login')}</a>
              </Link>
              </p>

              <p className="text-left">
                Khi nhấn Đăng ký, bạn đã đồng ý thực hiện mọi giao dịch mua bán theo <a href="#"
                                                                                        rel="noopener noreferrer"
                                                                                        target="_blank">Điều kiện sử
                dụng & chính sách</a> của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default withoutAuth(Register);
