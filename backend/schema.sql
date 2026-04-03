
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         VARCHAR(20),
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(100) NOT NULL,
  age                 INT CHECK (age >= 18 AND age <= 80),
  gender              VARCHAR(20),
  bio                 TEXT,
  photo_url           TEXT,
  city                VARCHAR(100),
  locality            VARCHAR(100),
  budget_min          INT NOT NULL DEFAULT 0,
  budget_max          INT NOT NULL,
  occupation          VARCHAR(100),
  lifestyle_tags      TEXT[] DEFAULT '{}',
  compatibility_score FLOAT DEFAULT 0.0,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE swipes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  swiped_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction   VARCHAR(5) CHECK (direction IN ('left', 'right')) NOT NULL,
  swiped_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (swiper_id, swiped_id)
);

CREATE TABLE matches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_at  TIMESTAMPTZ DEFAULT NOW(),
  is_active   BOOLEAN DEFAULT TRUE,
  UNIQUE (user1_id, user2_id)
);

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_budget ON profiles(budget_min, budget_max);
CREATE INDEX idx_profiles_score ON profiles(compatibility_score DESC);
CREATE INDEX idx_profiles_tags ON profiles USING GIN(lifestyle_tags);
CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_messages_match ON messages(match_id, sent_at DESC);
CREATE INDEX idx_messages_unread ON messages(match_id, is_read) WHERE is_read = FALSE;