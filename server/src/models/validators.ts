import moment from 'moment'
import {DocumentType} from '@typegoose/typegoose';
import {Todo} from './todos';

export function dueDateValidator(this: DocumentType<Todo>, v: Date) {
    if (!v) {
        return;
    }

    const val = moment(v).utc();
    if (!val.isValid()) {
        throw new Error(`dueDate has illegal format: '${v}'`);
    }
    const createdAt = (this.createdAt ? moment(this.createdAt) : moment()).utc();
    if (val.startOf('day').isBefore(createdAt)) {
        throw new Error(`dueDate should not be earlier, than Todo date: '${createdAt.format(moment.HTML5_FMT.DATE)}'`);
    }
};

export function finishedOnValidator(this: DocumentType<Todo>, v: Date) {
    if (!v) {
        return;
    }

    const val = moment(v).utc();
    const createdAt = (this.createdAt ? moment(this.createdAt) : moment()).utc();
    
    if (val.startOf('day').isBefore(createdAt)) {
        throw new Error(`finishedOn should not be earlier, than Todo date: '${createdAt.format(moment.HTML5_FMT.DATE)}'`);
    }
}
