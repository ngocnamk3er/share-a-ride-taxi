package openerp.openerpresourceserver.repo;


import openerp.openerpresourceserver.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, String> {

}
