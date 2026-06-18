import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema, listQuerySchema } from '../validators/common.validator.js';
import { ROLES } from '../constants/enums.js';

const staffRoles = [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.MANAGER];

export const createCrudRouter = ({ controller, createSchema, updateSchema = createSchema, roles = staffRoles }) => {
  const router = Router();

  router.use(authenticate);
  router.get('/', validate(listQuerySchema), controller.list);
  router.get('/:id', validate(idParamSchema), controller.get);
  router.post('/', authorizeRoles(...roles), validate(createSchema), controller.create);
  router.put('/:id', authorizeRoles(...roles), validate(updateSchema), controller.update);
  router.delete('/:id', authorizeRoles(...roles), validate(idParamSchema), controller.remove);

  return router;
};
