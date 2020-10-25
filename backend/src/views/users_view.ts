import User from "../models/users";
import Image from "../models/image";

export default {
    render(user: User){
        return {
            name: user.name,
            last_name: user.last_name,
            full_name: user.name + ' ' + user.last_name,
            email: user.email
        };
    },

    renderMany(users: User[]){
        return users.map(user => this.render(user));
    }

}
