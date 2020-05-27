import alertify from "alertifyjs";
import { AlertStatusEnum } from '../types/types'

alertify.set('notifier', 'position', 'top-right');


export const showAlert = (status, text) => {
	if (status === AlertStatusEnum.Success)
		alertify.success(text) 
	else if (status === AlertStatusEnum.Error)
		alertify.error(text)
	else if (status === AlertStatusEnum.Warn)
		alertify.warn(text)
}
