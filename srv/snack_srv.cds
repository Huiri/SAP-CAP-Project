using Huiri_Head.snack from '../db/snack';
service snackService {
    entity Snack as projection on snack.Snack;
}