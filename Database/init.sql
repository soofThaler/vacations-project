CREATE DATABASE vacation_management;
USE vacation_management;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL
);

CREATE TABLE vacations (
    vacation_id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_name VARCHAR(255) NOT NULL
);

CREATE TABLE likes (
    user_id INT NOT NULL,
    vacation_id INT NOT NULL,
    PRIMARY KEY (user_id, vacation_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- INSERT INITIAL DATA
-- --------------------------------------------------------

-- Insert Users (Passwords are hashed versions of "1234")
INSERT INTO users (first_name, last_name, email, password, role_id) VALUES
('System', 'Admin', 'admin@admin.com', 'fac6b0a6a69be7083aeec66be213cdda35f2b142e838976537fe5f021ed9f694595b03735e1c3070905c30f80becec66d714c211dfde3f8ae83d3f99cbf2d810', 1),
('Regular', 'User', 'user@user.com', 'fac6b0a6a69be7083aeec66be213cdda35f2b142e838976537fe5f021ed9f694595b03735e1c3070905c30f80becec66d714c211dfde3f8ae83d3f99cbf2d810', 2);

-- Insert 12 Authentic Vacations
INSERT INTO vacations (destination, description, start_date, end_date, price, image_name) VALUES
('Paris, France', 'Experience the magic of the Eiffel Tower, the Louvre, and charming Parisian cafes along the Seine.', '2026-06-15', '2026-06-22', 1200.00, 'paris.jpg'),
('Tokyo, Japan', 'Dive into the bustling streets of Shibuya, visit ancient temples, and enjoy authentic sushi.', '2026-09-10', '2026-09-24', 2500.50, 'tokyo.jpg'),
('Rome, Italy', 'Step back in time at the Colosseum, throw a coin in the Trevi Fountain, and eat endless pasta.', '2026-07-05', '2026-07-12', 1150.00, 'rome.jpg'),
('New York City, USA', 'The city that never sleeps! Broadway shows, Central Park, and the Statue of Liberty await.', '2026-08-20', '2026-08-27', 1800.00, 'newyork.jpg'),
('Bali, Indonesia', 'Relax on beautiful beaches, explore lush rice terraces, and find your zen in Ubud.', '2026-11-01', '2026-11-15', 950.00, 'bali.jpg'),
('London, UK', 'Visit Buckingham Palace, ride the London Eye, and catch a West End musical.', '2026-05-10', '2026-05-17', 1300.00, 'london.jpg'),
('Santorini, Greece', 'Stunning white buildings, blue domes, and the world''s most famous sunsets over the Aegean Sea.', '2026-06-01', '2026-06-10', 1600.00, 'santorini.jpg'),
('Dubai, UAE', 'Luxury shopping, ultramodern architecture, and a lively nightlife scene.', '2026-12-10', '2026-12-17', 2200.00, 'dubai.jpg'),
('Barcelona, Spain', 'Admire Gaudi''s architecture, stroll down La Rambla, and enjoy delicious tapas.', '2026-09-01', '2026-09-08', 1050.00, 'barcelona.jpg'),
('Phuket, Thailand', 'Tropical island paradise featuring stunning beaches, vibrant nightlife, and diving spots.', '2026-01-15', '2026-01-25', 850.00, 'phuket.jpg'),
('Reykjavik, Iceland', 'Explore geysers, waterfalls, and maybe catch a glimpse of the Northern Lights.', '2026-02-10', '2026-02-18', 1900.00, 'reykjavik.jpg'),
('Sydney, Australia', 'Surf at Bondi Beach, visit the iconic Opera House, and climb the Harbour Bridge.', '2026-10-15', '2026-10-25', 2800.00, 'sydney.jpg');

-- Insert Sample Likes (User 2 liking some vacations)
INSERT INTO likes (user_id, vacation_id) VALUES
(2, 1),
(2, 3),
(2, 7),
(2, 9);
